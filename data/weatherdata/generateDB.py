#!/usr/bin/python3
import sqlite3
import requests
import csv

######################
# For how to use sqlite3 with python, check https://docs.python.org/3/library/sqlite3.html
######################

matches = {}


def preloadMatches():
    for row in cur.execute("SELECT * FROM coordinates"):
        matches[(row[1], row[2])] = row[0]


def parseFile(year, month, day, hour=None):
    if hour is None:
        url = fr"https://share:123456@nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/{year}{month:02}/CN-Reanalysis-daily-{year}{month:02}{day:02}00.csv"
    else:
        url = fr"https://share:123456@nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/{year}/CN-Reanalysis{year}{month:02}{day:02}{hour:02}.csv"
    r = requests.get(url)
    r.encoding = 'utf-8'
    data = csv.reader(r.text.splitlines(), delimiter=',')
    next(data, None)
    weather = []
    # idx = 1
    for row in data:
        # print("Parsing line {0}".format(idx), end="\r", flush=True)
        # idx += 1
        if len(row) > 1:
            getCity(float(row[12]), float(row[11]))
            weather.append([
                None,
                year,
                month,
                day,
                hour,
                float(row[11]),
                float(row[12]),
                getCity(float(row[12]), float(row[11])),
                float(row[0]),
                float(row[1]),
                float(row[5]),
                float(row[4]),
                float(row[2]),
                float(row[3]),
                float(row[6]),
                float(row[7]),
                float(row[8]),
                float(row[9]),
                float(row[10])
            ])
    cur.executemany("INSERT INTO weatherdata VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", weather)

    con.commit()


def getCity(longitude: float, latitude: float):
    if (latitude, longitude) in matches:
        return matches[(latitude, longitude)]
    cur.execute("SELECT adcode FROM coordinates WHERE lon = ? AND lat = ?", [longitude, latitude])
    tmp = cur.fetchone()
    if tmp is not None:
        return tmp[0]

    amapURL = r"https://restapi.amap.com/v3/geocode/regeo"
    payload = {
        "key": "1eb09603c5d865d6750c0c6ad74ff86d",
        "location": "{0},{1}".format(longitude, latitude)
    }
    r = requests.get(amapURL, params=payload)
    jsonData = r.json()
    city = {}
    if jsonData['status'] == '1':
        c = jsonData['regeocode']['addressComponent']['city']
        if c == []:
            c = jsonData['regeocode']['addressComponent']['district']
            if c == []:
                c = None
        city['city'] = c
        city['province'] = jsonData['regeocode']['addressComponent']['province']
        city['adcode'] = jsonData['regeocode']['addressComponent']['adcode']
        if city['adcode'] == [] or city['adcode'] == "900000":
            city = {
                'city': "ERROR",
                'province': "ERROR",
                'adcode': "000000"
            }
        cur.execute("SELECT * FROM cities WHERE adcode=?", [city['adcode']])
        if cur.fetchone() is None:
            print(city)
            cur.execute("INSERT INTO cities VALUES(:adcode, :city, :province)", city)
        cur.execute("INSERT INTO coordinates VALUES(?, ?, ?)", [city['adcode'], latitude, longitude])
        con.commit()
        return city['adcode']
    else:
        raise LookupError("Location not found for ({0}, {1})".format(longitude, latitude))


if __name__ == "__main__":
    try:
        con = sqlite3.connect("data.db")
        cur = con.cursor()

        preloadMatches()

        y = 2015
        # m = 8
        d = 25
        h = 14

        month = 1

        for year in range(2013, 2019):
            for day in range(1, 32):
                # if year < y or (year == y and month < m) or (year == y and month == m and day < d):
                    # continue

                for hour in range(24):
                    if year < y or (year == y and day < d) or (year == y and day == d and hour < h):
                        continue
                    print(f"Parsing file for {year}-{month}-{day} {hour}")
                    parseFile(year, month, day, hour)
                    print(f"{year}-{month}-{day} {hour} saved to database")

                

        con.close()

    except KeyboardInterrupt:
        con.close()
