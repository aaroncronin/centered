const puppeteer = require("puppeteer");
const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");
const { time } = require("console");

(async () => {
  let url =
    "https://mindbody.io/fitness/search/classes?page=1&location=New+York%2C+NY%2C+US&q=wellness";

  let browser = await puppeteer.launch();

  let page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  let data = await page.evaluate(() => {
    let pageUrls = [];

    let numPages = document
      .querySelector(".Pagination_wrapper__3JvS3 div")
      .innerText.split(" ")[2];

    for (let i = 1; i < parseInt(numPages) + 1; i++) {
      pageUrls.push(
        `https://mindbody.io/fitness/search/classes?page=${i}&location=New+York%2C+NY%2C+US&q=wellness`
      );
    }

    return pageUrls;
  });

  let datadata = [];
  for (let jjj of data) {
    await page.goto(jjj, { waitUntil: "networkidle2" });

    let classLinkData = await page.evaluate(() => {
      const baseUrl = "https://mindbody.io";
      let classLinks = [];
      document.querySelectorAll(".ResultsPage_listItem__jJT5O").forEach((d) => {
        classLinks.push(
          baseUrl +
            d.querySelector(".ListDetailItem_link__1fBeK").getAttribute("href")
        );
      });
      return classLinks;
    });
    let prom = Promise.resolve(classLinkData);
    prom.then(function (val) {
      datadata.push(val);
    });
  }

  var merged = [].concat.apply([], datadata);
  //merged.forEach((ele) => console.log(ele));
  let content = [];
  for (let link of merged) {
    await page.goto(link, { waitUntil: "networkidle2" });

    //const newData = await page.$$eval(".level-right", (ele) => ele);
    await page.waitForSelector(
      // ".column.is-5-desktop.DetailHeader_content__2TwFs"
      ".StickyBar_visible__2aOM9"
    );
    let newData = await page.evaluate(() => {
      const days = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
      };
      function convertTime12to24(time12h) {
        const modifier = time12h.slice(-2);
        const time = time12h.split(modifier)[0];
        let [hours, minutes] = time.split(":");

        if (hours === "12") {
          hours = "00";
        }

        if (modifier === "pm") {
          hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
      }
      const category = document.querySelector(".DetailHeader_category__1NCIZ")
        .textContent;
      const name = document.querySelector(".DetailHeader_name__2uq69")
        .textContent;
      const studio = document.querySelector(".DetailHeader_subname__37izu")
        .textContent;
      const address = document.querySelector(".DetailHeader_address__3jDc1")
        .textContent;
      const phone = document.querySelector(".PhoneNumber_link__23Djt")
        .textContent;

      const date = (
        document
          .querySelector(".DatePickerPopup_value__1ekmq")
          .textContent.split(", ")[1] +
        ", " +
        new Date().getFullYear()
      ).replace(",", "");

      const day = days[new Date(date).getDay()];
      const time = document.querySelector(".mbselect__single-value")
        .textContent;

      const start_time = `${date} ${convertTime12to24(time.split(" - ")[0])}`;
      const end_time = `${date} ${convertTime12to24(
        time.split(" - ")[1].split(" ")[0]
      )}`;

      const startTimeFinal = `${day} ${start_time}:00 GMT-0400 (EDT)`;
      const endTimeFinal = `${day} ${end_time}:00 GMT-0400 (EDT)`;
      const image = document
        .querySelector(".image.is-5by3 img")
        .getAttribute("src");
      const description = document.querySelector(".column.is-half p")
        .textContent;

      let arr = {
        category,
        name,
        studio,
        address,
        phone,
        startTimeFinal,
        endTimeFinal,
        image,
        description,
      };

      return arr;
    });
    newData["link"] = link;

    content.push(newData);
  }

  new ObjectsToCsv(content).toDisk("./test.csv");

  await browser.close();
})();

/**
 * category: .ClassTimeDetails_category__sLaU5
 * name: .ClassTimeDetails_name__3p-hJ
 * price: .Price_price__295Er
 * location: .ClassTimeStudioDetails_location__1YDkB
 * details: .ClassTimeStudioDetails_time__3gR-L
 */
