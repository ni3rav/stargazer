import json
from datetime import datetime, timedelta, timezone

import requests

from .cache import redis_conn


class SpacedevsAPI:
    def __init__(self):
        self.base_url = "https://ll.thespacedevs.com"
        self.redis = redis_conn()

    def events(self):
        if resp := self.redis.get("SPACEDEVS_EVENTS"):
            return json.loads(resp)

        response = requests.get(url=f"{self.base_url}/2.2.0/event/")
        results = response.json()["results"]
        eventlst = []
        for item in range(len(results)):
            eventlst.append(
                {
                    "name": results[item]["name"],
                    "description": results[item]["description"],
                    "image": results[item]["feature_image"],
                    "news_url": results[item]["news_url"],
                    "video_url": results[item]["video_url"],
                }
            )

        self.redis.setex("SPACEDEVS_EVENTS", timedelta(hours=1), json.dumps(eventlst))

        return eventlst

    def launches(self):
        if resp := self.redis.get("SPACEDEVS_LAUNCHES"):
            return json.loads(resp)

        response = requests.get(url=f"{self.base_url}/2.2.0/launch/upcoming")
        results = response.json()["results"]
        launchlst = []

        current_time = datetime.now(timezone.utc)
        for item in range(len(results)):
            launch_time = results[item]["window_start"]
            if datetime.fromisoformat(launch_time) < current_time:
                continue

            launchlst.append(
                {
                    "name": results[item]["name"],
                    "time": launch_time,
                }
            )

        self.redis.setex(
            "SPACEDEVS_LAUNCHES", timedelta(hours=1), json.dumps(launchlst)
        )
        return launchlst

    def news(self):
        if resp := self.redis.get("SPACEDEVS_NEWS"):
            return json.loads(resp)

        response = requests.get(url="https://api.spaceflightnewsapi.net/v4/articles")
        results = response.json()["results"]
        newslst = []

        for item in range(len(results)):
            newslst.append(
                {
                    "title": results[item]["title"],
                    "image": results[item]["image_url"],
                    "site": results[item]["news_site"],
                }
            )

        self.redis.setex("SPACEDEVS_NEWS", timedelta(hours=1), json.dumps(newslst))
        return newslst


if __name__ == "__main__":
    SpacedevsAPI()
