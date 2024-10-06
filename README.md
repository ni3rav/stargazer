# stargazer

A beautiful astronomy dashboard.

Access it here: https://stargazer-5q5fv.ondigitalocean.app/

# Features

The dashboard consists of:

- NASA Astronomy Picture of the Day
- Interactive Fireball Map
- Upcoming astronomy events
- Upcoming shuttle launches
- Chatbot
- 3D Constellation Map


# Setup Instructions

### Using Docker

1. Clone the repository.

2. Setup environment variables.

```env
NASA_API_KEY=
REDIS_PASSWORD=
REDIS_HOST=
REDIS_PORT=
GEMINI_API_KEY=
SECRET_KEY=
```

Make a `.env` file in the backend directory with the above content.

3. Build the image.

```
docker build .
```

this image is production-optimised (you might want to tag it as well).

4. Run the container.

```
docker run -p 8000:8000 --env-file ./backend/.env shravanasati/stargazer
```

substitute the image name/hash.


### Manual setup

1. Clone the repository.

2. `pnpm i`

3. `pnpm dev`

This will *only* run the vite server. If you want to run the backend, you first need to build the assets.

4. `pnpm build`

To run the backend server, `cd` into the backend directory and create a virtual environment.

5. `python3 -m venv venv`

Activate the virtual environment using

```
source ./venv/bin/activate
```
on Linux systems (there's also a `.csh` and a `.fish` script for those respective shells)

```
./venv/bin/Activate.ps1
```

on Windows (powershell)

6. Install dependencies using 

```
poetry install
```

7. Setup environment variables.

```env
NASA_API_KEY=
REDIS_PASSWORD=
REDIS_HOST=
REDIS_PORT=
GEMINI_API_KEY=
SECRET_KEY=
```

Make a `.env` file in the backend directory with the above content.


8. Run the server.

```
stella run server
```

this would require [stella](https://github.com/shravanasati/stellapy) to be installed and offers live reload for the server (the default flask one sucks).

Alternatively,

```
flask --app app run
```


# References

Special thanks to [celestial-js](https://github.com/ofrohn/d3-celestial/) for the constellation map, NASA and Spacedevs for the data.