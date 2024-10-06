import json
import logging
import os
from datetime import datetime, timedelta
from io import BytesIO

import folium
import pandas as pd
from dotenv import load_dotenv
from nasapy import Nasa, fireballs

from .cache import redis_conn

load_dotenv()


class NasaAPI:
    def __init__(self) -> None:
        self.nasa = Nasa(os.environ["NASA_API_KEY"])
        self.redis = redis_conn()

    def potd(self):
        """
        Return the picture of the day.
        """
        try:
            if resp := self.redis.get("NASA_POTD"):
                return json.loads(resp)

            resp = self.nasa.picture_of_the_day(hd=True)
            mapping = {
                "title": resp["title"],
                "hdurl": resp["hdurl"],
                "url": resp["url"],
                "description": resp["explanation"],
            }
            self.redis.setex(
                "NASA_POTD",
                timedelta(hours=1),
                json.dumps(mapping),
            )
            return resp

        except Exception as e:
            logging.error("error occured while fetching POTD")
            logging.exception(e)
            return {"error": "Unable to load the picture of the day."}

    def _fireballs(self):
        if resp := self.redis.get("NASA_FIREBALLS"):
            return pd.DataFrame.from_dict(json.loads(resp))

        today = datetime.now().date()
        last_month = today - timedelta(days=365)
        df = fireballs(date_min=str(last_month), return_df=True)
        df.dropna(inplace=True)
        df["lat"] = df["lat"].astype(float)
        df["lon"] = df["lon"].astype(float)
        df["energy"] = df["energy"].astype(float)

        self.redis.setex("NASA_FIREBALLS", timedelta(hours=1), df.to_json())
        return df

    def fireball_map(self):
        m = folium.Map(zoom_start=7)
        fb = self._fireballs()
        for i in range(0, len(fb)):
            folium.Circle(
                location=[fb.iloc[i]["lat"], fb.iloc[i]["lon"]],
                tooltip=[
                    "Date: " + fb.iloc[i]["date"],
                    "\nLat/Lon: "
                    + str(fb.iloc[i]["lat"])
                    + ", "
                    + str(fb.iloc[i]["lon"]),
                ],
                radius=fb.iloc[i]["energy"] * 10,
                color="red",
                fill=True,
                fill_color="red",
            ).add_to(m)

        html_buf = BytesIO()
        m.save(html_buf, close_file=False)
        html_buf.seek(0)
        return html_buf

    def weather(self):
        return self.nasa.mars_weather()


if __name__ == "__main__":
    print(NasaAPI()._fireballs())
