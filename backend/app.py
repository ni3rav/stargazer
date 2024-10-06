import logging
import os
import pickle
from datetime import datetime, timedelta
from pathlib import Path

from apis.cache import redis_close, redis_conn
from apis.chatbot import create_chat
from apis.nasa import NasaAPI
from apis.spacedevs import SpacedevsAPI
from dotenv import load_dotenv
from flask import Flask, abort, request, send_from_directory, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from google.generativeai.types.generation_types import StopCandidateException

load_dotenv()

redis_client = redis_conn()
app = Flask(__file__)
app.secret_key = os.environ["SECRET_KEY"]
dist_dir = Path(__file__).parent.parent / "dist"
app.static_folder = str(dist_dir)
assets_folder = str(dist_dir / "assets")
nasa_client = NasaAPI()
spacedevs_client = SpacedevsAPI()
HOUR_TIMEDELTA = timedelta(hours=1)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["600/minute", "10/second"],
    storage_uri="memory://",
)


@app.teardown_appcontext
def teardown_redis(exception):
    redis_close()


@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = HOUR_TIMEDELTA


@app.errorhandler(404)
def not_found_handler(exc):
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(429)
def ratelimit_handler(exc):
    now = datetime.now()
    reset = datetime.fromtimestamp(limiter.current_limit.reset_at)
    delta = (reset - now).seconds
    return {
        "error": f"rate limit exceeded, please try again after {delta} seconds"
    }, 429


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.get("/<path:path>")
def assets(path):
    return send_from_directory(app.static_folder, path)


@app.get("/api/events")
def events():
    try:
        return spacedevs_client.events()
    except Exception as e:
        logging.error("error in events endpoint")
        logging.exception(e)
        return {"error": "an internal server error occured, please try again later"}


@app.get("/api/launches")
def launches():
    try:
        return spacedevs_client.launches()
    except Exception as e:
        logging.error("error in launches endpoint")
        logging.exception(e)
        return {"error": "an internal server error occured, please try again later"}


@app.get("/api/news")
def news():
    try:
        return spacedevs_client.news()
    except Exception as e:
        logging.error("error in news endpoint")
        logging.exception(e)
        return {"error": "an internal server error occured, please try again later"}


@app.get("/api/ping")
def ping():
    return {"message": "pong"}


@app.get("/api/potd")
def potd():
    try:
        return nasa_client.potd()
    except Exception as e:
        logging.error("error in potd endpoint")
        logging.exception(e)
        return {"error": "an internal server error occured, please try again later"}


@app.get("/api/fireball_map")
@limiter.limit("1/10second")
def fireball_map():
    return {"html": nasa_client.fireball_map().read().decode("utf-8")}


@app.post("/api/chat/send")
@limiter.limit("1/4second")
def chat_gemini():
    try:
        rjson = request.get_json()
        if not rjson:
            abort(415)

        query = rjson.get("message")
        if not query:
            abort(400)

        # print(f"{query=}")

        if "chatID" in session:
            # print("found chatID in session")
            chatID = session["chatID"]
            # print(f"{chatID=}")
            try:
                pickled_chat_history = redis_client.get(chatID)
            except UnicodeDecodeError as e:
                pickled_chat_history = e.object
            if not pickled_chat_history:
                return {"message": "Your session has expired. Please try again later."}
            chat_history = pickle.loads(pickled_chat_history)
            # print(f"{chat_history=}")
            _, chat = create_chat(chat_history)
        else:
            # print("creating new chat instance")
            chatID, chat = create_chat()

        resp = chat.send_message(query).text
        # print(f"{resp=}")
        session["chatID"] = chatID
        redis_client.setex(chatID, HOUR_TIMEDELTA, pickle.dumps(chat.history))
        return {"message": resp}

    except StopCandidateException:
        return {"message": "I cannot answer that."}

    except Exception as e:
        logging.exception(e)
        return {
            "message": "It seems we're out of service at the moment, try again later."
        }


@app.get("/api/chat/list")
def chat_history_list():
    if "chatID" in session:
        chatID = session["chatID"]
        try:
            pickled_chat_history = redis_client.get(chatID)
        except UnicodeDecodeError as e:
            pickled_chat_history = e.object
        if not pickled_chat_history:
            return []
        chat_history = pickle.loads(pickled_chat_history)
        return [
            {"role": message.role, "content": " ".join([p.text for p in message.parts])}
            for message in chat_history
        ]

    return []


@app.post("/api/summarize")
def summarize():
    try:
        rjson = request.get_json()
        if not rjson:
            abort(415)
        url = rjson.get("url")
        if not url:
            abort(400)

        _, chat = create_chat()
        summ = chat.send_message(f"Please summarize this URL in 50 words: {url}").text
        return {"summary": summ}

    except Exception as e:
        logging.exception(e)
        return {"error": "an internal server error occured, try again later"}


if __name__ == "__main__":
    app.run()
