#!/usr/bin/python3
import sqlite3
import requests
import csv

######################
# For how to use sqlite3 with python, check https://docs.python.org/3/library/sqlite3.html
######################


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
    idx = 1
    for row in data:
        print("Parsing line {0}".format(idx), end="\r", flush=True)
        idx += 1
        if len(row) > 1:
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
    cur.execute("SELECT citycode FROM coordinates WHERE lon = ? AND lat = ?", [longitude, latitude])
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
        city['citycode'] = jsonData['regeocode']['addressComponent']['citycode']
        if city['citycode'] == []:
            city = {
                'city': "ERROR",
                'province': "ERROR",
                'citycode': "000000"
            }
        cur.execute("SELECT * FROM cities WHERE citycode=?", [city['citycode']])
        if cur.fetchone() is None:
            print(city)
            cur.execute("INSERT INTO cities VALUES(:citycode, :city, :province)", city)
        cur.execute("INSERT INTO coordinates VALUES(?, ?, ?)", [city['citycode'], latitude, longitude])
        con.commit()
        return city['citycode']
    else:
        raise LookupError("Location not found for ({0}, {1})".format(longitude, latitude))


if __name__ == "__main__":
    try:
        con = sqlite3.connect("data.db")
        cur = con.cursor()

        for year in range(2013, 2019):
            for month in range(1, 13):
                maxDay = 31
                if month == 2:
                    maxDay = 29 if year == 2016 else 28
                if month in [4, 6, 9, 11]:
                    maxDay = 30
                for day in (1, maxDay + 1):
                    print(f"Parsing file for {year}-{month}-{day}")
                    parseFile(year, month, day)
                    print(f"{year}-{month}-{day} saved to database")

        con.close()

    except KeyboardInterrupt:
        con.close()
