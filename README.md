# Videotest

A tool for performing perceptual experiments using videos, developed as part of my master's thesis. Features:

 * Serves videos
 * Forces user to watch entire video before they can submit a perceived quality rating
 * Supports training videos
 * Randomizes the order of experiment videos
 * Stores results as simple-to-parse json files.

## How to use

Create your own manifest.json file and put it in a folder inside `static`. I suggest using UUID.

The manifest file looks like this:

```
{
    "title": "Test title",
    "author": "Author",
    "contact": "email",
    "explanation": "lobby.md",
    "range": {
        "max_range": 7,
        "min_label": "Very bad",
        "max_label": "Very good"
    },
    "min_screen_size": 1300,
    "training": [
        {
            "title": "Bad",
            "description": "very bad",
            "file": "videos/c0.1_n0.995.mp4"
        },
        {
            "title": "Good",
            "description": "super good",
            "file": "videos/c0.02_n0.9.mp4"
        }
    ],
    "files": [
        "videos/c0.03_n0.95.mp4",
        "videos/c0.05_n0.95.mp4",
        "videos/c0.02_n0.9.mp4",
        "videos/c0.09_n0.95.mp4",
        "videos/c0.01_n0.99.mp4",
        "videos/c0.1_n0.995.mp4"
    ]
}
```

Easiest way to deploy is with a `docker-compose` file like this:

```
version: "3"
services:
  vidoetest:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      OUTPUT_PATH: /out
    volumes:
      - "/srv/videotest/out:/out"
```

Deploy with `docker-compose up -d`. Terminating TLS is left as an exercise for the reader.

After deployment, your test will be avilable at `(domain)/(uuid)/`, where `(uuid)` is the one you should have determined previously.

## Things that should be improved

 * Better margin on buttons
 * No default value on the slider
