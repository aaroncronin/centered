const rp = require("request-promise");
const $ = require("cheerio");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const CATEGORY = null;
const KEYWORDS = ["wellness"];
const URL = `https://www.eventbrite.com/d/online/all-events/${KEYWORDS.join(
  "-"
)}/?page=%pn`;
const csv_name = `eventbrite_${new Date()}.csv`;

const MONTHS = [
  {
    abbreviation: "Jan",
    name: "January",
  },
  {
    abbreviation: "Feb",
    name: "February",
  },
  {
    abbreviation: "Mar",
    name: "March",
  },
  {
    abbreviation: "Apr",
    name: "April",
  },
  {
    abbreviation: "May",
    name: "May",
  },
  {
    abbreviation: "Jun",
    name: "June",
  },
  {
    abbreviation: "Jul",
    name: "July",
  },
  {
    abbreviation: "Aug",
    name: "August",
  },
  {
    abbreviation: "Sep",
    name: "September",
  },
  {
    abbreviation: "Oct",
    name: "October",
  },
  {
    abbreviation: "Nov",
    name: "November",
  },
  {
    abbreviation: "Dec",
    name: "December",
  },
];

const csvWriter = createCsvWriter({
  path: csv_name,
  header: [
    { id: "title", title: "title" },
    { id: "organizer", title: "organizer" },
    { id: "start_date", title: "start_date" },
    { id: "end_date", title: "end_date" },
    { id: "timezone", title: "timezone" },
    { id: "date_string", title: "date_string" },
    { id: "website", title: "website" },
    { id: "description", title: "description" },
    { id: "image", title: "image" },
  ],
});

function convertDate(dateString) {
  try {
    [y, m, d] = dateString
      .split("T")[0]
      .split("-")
      .map((i) => parseInt(i));
    return `${MONTHS[m - 1].name} ${d} ${y}`;
  } catch (e) {
    return dateString;
  }
}

function extractTimeZone(text) {
  try {
    const regex = /(AM|PM) (.*)/gi;
    const found = text.search(regex);
    if (found >= 0) {
      suffix = "";
      try {
        suffix = text.match(/\((\+|\-).*\d\)/g)[0];
      } catch (e) {}
      return text.match(regex)[0].split(" ")[1] + suffix;
    } else {
      throw "Timezone Not Available";
    }
  } catch (e) {
    return text;
  }
}

function extractDetails(href, data = {}, attempts = 0) {
  const ed_LIMIT = 5;
  console.log("Attempting an Extract: ", href);
  try {
    const regex = /[\n\r\t]/g;
    return rp({
      uri: href,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36",
      },
      json: true,
    })
      .then((html) => {
        try {
          let title = $('meta[name="twitter:title"]', html);
          data["title"] = title.prop("content");
        } catch (e) {
          data["title"] = null;
          console.log("NO title");
        }
        try {
          data["description"] = $(
            ".structured-content .has-user-generated-content",
            html
          )
            .text()
            .replace(regex, "")
            .replace(/undefined/g);
        } catch (e) {
          try {
            data["description"] = $('meta[name="twitter:description"]', html)
              .prop("content")
              .replace(regex)
              .replace(/undefined/g);
          } catch (e) {
            data["description"] = null;
            console.log("NO description");
          }
        }
        try {
          data["image"] = $('meta[name="twitter:image"]', html).prop("content");
        } catch (e) {
          data["image"] = null;
          console.log("NO image");
        }
        try {
          data["website"] = href;
        } catch (e) {
          data["website"] = null;
          console.log("NO website");
        }
        try {
          data["date_string"] = $(
            'meta[property="event:start_time"]',
            html
          ).prop("content");
        } catch (e) {
          try {
            data["date_string"] = $(
              'meta[property="name="twitter:data2"]',
              html
            ).prop("value");
          } catch (e) {
            data["date_string"] = null;
            console.log("NO date_string");
          }
        }
        try {
          data["start_date"] = convertDate(
            $('meta[property="event:start_time"]', html).prop("content")
          );
          if (data["start_date"] === "") {
            throw "No date";
          }
        } catch (e) {
          try {
            data["start_date"] = $(
              'meta[property="name="twitter:data2"]',
              html
            ).prop("value");
          } catch (e) {
            data["start_date"] = null;
            console.log("NO date_string");
          }
        }
        try {
          data["end_date"] = convertDate(
            $('meta[property="event:end_time"]', html).prop("content")
          );
        } catch (e) {
          try {
            data["end_date"] = $(
              'meta[property="name="twitter:data2"]',
              html
            ).prop("value");
          } catch (e) {
            data["end_date"] = null;
            console.log("NO date_string");
          }
        }
        try {
          data["organizer"] = $(
            "a.js-d-scroll-to.listing-organizer-name.text-default",
            html
          )
            .text()
            .replace(regex, "");
        } catch (e) {
          try {
            data["organizer"] = $("div#organizer_header", html).text();
          } catch (e) {
            data["organizer"] = null;
            console.log("NO organizer");
          }
        }
        data["organizer"] = data["organizer"].replace("by ", "");

        return data; //[data["title"],data["organizer"],data["start_date"],data["end_date"],data["timezone"],data["date_string"],data["website"],data["description"],data["image"]];
      })
      .catch(() => {
        return {
          title: null,
          description: null,
          image: null,
          website: null,
          date_string: null,
          start_date: null,
          end_date: null,
          organizer: null,
          timezone: null,
        };
        /*
            if(attempts < ed_LIMIT){
                setTimeout(() =>{
                    console.log(`Request error - trying again - ${attempts}/ ${ed_LIMIT}`);
                    return extractDetails(href,data = {}, attempts + 1);
                },2000)
            } else {
                return data;
            }
            */
      });
  } catch (e) {
    return {
      title: null,
      description: null,
      image: null,
      website: null,
      date_string: null,
      start_date: null,
      end_date: null,
      organizer: null,
      timezone: null,
    };
  }
}

(async () => {
  let start_page = 1,
    max_page = process.argv.length === 3 ? parseInt(process.argv[2]) : 500,
    master = [],
    dupes = {},
    avoided = 0,
    THROTTLE = 10000,
    shouldScrape = true;
  try {
    let rawdata = fs.readFileSync("dupes.json");
    dupes = JSON.parse(rawdata);
  } catch (e) {
    console.log("dupes doesn't exist yet");
  }
  function exitHandler() {
    csvWriter.writeRecords(master).then(() => {
      console.log(
        `Scrape completed: ${master.length} records extracted into '${csv_name}'.`
      );
      fs.writeFile("dupes.json", JSON.stringify(dupes), (err) => {
        if (err) throw err;
        console.log(
          `Updated dupes.json: ${
            Object.keys(dupes).length
          } unique urls.  Avoided ${avoided} duplicate urls.`
        );
      });
    });
  }
  function scrape(page) {
    let localData = [];
    console.log("Scraping ", URL.replace("%pn", page));
    rp({
      uri: URL.replace("%pn", page),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36",
      },
      json: true,
    })
      .then((html) => {
        console.log("Success");
        try {
          if (
            $(".eds-l-pad-top-4.eds-text-bl.eds-l-pad-bot-2", html).text() ===
            "No events match your search"
          ) {
            shouldScrape = false;
          }
        } catch (e) {}
        $("div.eds-event-card-content__primary-content", html).each(function (
          i,
          elem
        ) {
          let href = $(this).find("a").attr("href");
          if (!dupes.hasOwnProperty(href)) {
            dupes[href] = href;
            let text = $(this).text();
            let timezone = extractTimeZone(text);
            let details = extractDetails(href, { timezone });
            localData.push(details);
          } else {
            avoided++;
          }
        });
        return Promise.all(localData);
      })
      .then((data) => {
        master = master.concat(data);

        if (page < max_page && shouldScrape) {
          scrape(page + 1);
        } else {
          exitHandler();
          console.log("finished");
        }
      })
      .catch(() => {
        console.log(`Caught an error - ${page}`);
        if (page < max_page && shouldScrape) {
          scrape(page + 1);
        } else {
          exitHandler();
          console.log("finished");
        }
      });
  }
  scrape(start_page);
})();
