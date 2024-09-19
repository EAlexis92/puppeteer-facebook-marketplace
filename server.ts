import puppeteer from "puppeteer-core";
import * as edgePaths from "edge-paths";
import { MongoClient, ObjectId } from "mongodb";

const EDGE_PATH = edgePaths.getEdgePath();
const uri = "mongodb://localhost:27017/facebook";
const client = new MongoClient(uri);

interface items {
  id: number;
  item: string;
  createdAt?: Date;
}

async function insertMany(tableName: string, items: any) {
  try {
    await client.connect();
    const database = client.db("facebook_marketplace");
    const marketplaceItems = database.collection(tableName);

    if (tableName !== "facebook_marketplace") {
      console.log(`Deleting records ${tableName}...`);
      await marketplaceItems.deleteMany({});
    }

    console.log(`Saving ${tableName}...`);
    await marketplaceItems.insertMany(items);
  } catch (e) {
    console.log("Connection was not sucessful many " + e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function findOne(tableName: string) {
  try {
    await client.connect();
    const database = client.db("facebook_marketplace");
    const marketplaceItems = database.collection(tableName);

    console.log(`Retrieving one ${tableName}...`);
    const find = await marketplaceItems
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    return find;
  } catch (e) {
    console.log("Connection was not sucessful " + e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function findAll(tableName: string) {
  try {
    await client.connect();
    const database = client.db("facebook_marketplace");
    const marketplaceItems = database.collection(tableName);

    console.log(`Retrieving all ${tableName}...`);
    const find = await marketplaceItems.find({}).toArray();
    return find;
  } catch (e) {
    console.log("Connection was not sucessful " + e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function changeOne(tableName: string) {
  try {
    await client.connect();
    const database = client.db("facebook_marketplace");
    const marketplaceItems = database.collection(tableName);

    console.log(`Updating one ${tableName}...`);
    const find = await marketplaceItems.updateOne(
      {
        _id: new ObjectId("66eb697bef83cf6eec74c25b"),
      },
      {
        $set: {
          i: 0,
          j: 0,
        },
      }
    );
    return find;
  } catch (e) {
    console.log("Connection was not sucessful " + e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe",
    headless: false,
    args: [
      "--start-maximized",
      "--user-data-dir=C:/Users/eddyt/AppData/Local/Microsoft/Edge/User Data/Default",
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.facebook.com", [
    "clipboard-read",
    "clipboard-write",
    "clipboard-sanitized-write",
  ]);

  await page.goto("https://www.facebook.com");

  const email = await page.evaluate(() => document.querySelector("#email"));

  if (Boolean(email)) {
    await page.type("#email", "eddytopete.a@hotmail.com");
    await page.type("#pass", "Alexis.1992562");
    await page.click("button");

    await page.waitForNavigation(); // The promise resolves after navigation has finished
  }

  await page.goto("https://www.facebook.com/marketplace/you/selling/", {
    waitUntil: "domcontentloaded",
  });
  await page.locator("html").click();

  let findLastestItemUrl = await findOne("marketplace_items");
  let findAllItems: any;
  let urlArray = [];

  console.log(findLastestItemUrl);

  if (Boolean(findLastestItemUrl)) {
    findAllItems = await findAll("marketplace_items");
    urlArray = findAllItems.map((item: { itemUrl: string }) => item.itemUrl);

    console.log(urlArray);

    await page
      .locator(
        `div.xw7yly9 > div > div > span > div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w > div > div:nth-child(1) div.x78zum5.x1a02dak.x18a7wqs.xkwlqfy > div:nth-child(3)`
      )
      .click();

    await page
      .locator(
        "div > div > div > div:nth-child(6) > div > div > div > div > div > div.x9f619.x1n2onr6.x1ja2u2z.x1wsgfga.x9otpla.xexx8yu.x18d9i69 > div > div > div:nth-child(4) > div"
      )
      .click();

    const clipboardContent = await page.evaluate(() => {
      const text = navigator.clipboard.readText();
      return text;
    });

    console.log(findLastestItemUrl[0].itemUrl, clipboardContent);

    if (findLastestItemUrl[0].itemUrl === clipboardContent) {
      await postItems();
    }
  }

  if (!Boolean(findLastestItemUrl)) {
    let previousHeight: any = 0;
    let newHeight: any = 1;

    while (previousHeight < newHeight) {
      previousHeight = newHeight;
      newHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

      await sleep(5000);
    }

    await page.evaluate("window.scrollTo(0, 0)");

    const items = await page.evaluate(
      () =>
        document.querySelectorAll(
          "span.x1lliihq.x1iyjqo2 > div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w > div > div"
        ).length
    );

    try {
      for (let i = 1; i <= items; i++) {
        const relistItem = await page.evaluate((i) => {
          const selector = document.querySelector(
            `div:nth-child(${i}) > div > div > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xsyo7zv.x16hj40l.xexx8yu.x18d9i69 > div > div.x1daaz14 > div > div:nth-child(2) > div > div > span > div > div > div.x6s0dn4.x78zum5.xl56j7k.x1608yet.xljgi0e.x1e0frkt > div:nth-child(2) > span > span`
          ) as HTMLDivElement;

          return (
            typeof selector !== "undefined" &&
            selector?.innerText !== "Relist this item"
          );
        }, i);

        console.log(relistItem);

        if (relistItem) {
          await page
            .locator(
              `div.xw7yly9 > div > div > span > div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w > div > div:nth-child(${i}) div.x78zum5.x1a02dak.x18a7wqs.xkwlqfy > div:nth-child(3)`
            )
            .click();

          await page
            .locator(
              "div > div > div > div:nth-child(6) > div > div > div > div > div > div.x9f619.x1n2onr6.x1ja2u2z.x1wsgfga.x9otpla.xexx8yu.x18d9i69 > div > div > div:nth-child(4) > div"
            )
            .click();

          const clipboardContent = await page.evaluate(() => {
            const text = navigator.clipboard.readText();
            return text;
          });

          urlArray.push({
            id: i === 1 ? items : items - i,
            itemUrl: clipboardContent,
          });
        }
      }

      await insertMany("marketplace_items", urlArray);
    } catch (e) {
      console.log("This is the error: " + e);
    }

    console.log(urlArray, urlArray.length);

    await postItems();
  }

  async function postItems() {
    const getFavorites = await findOne("favorite_groups");
    let textContent: any;
    let getAllFavorites: any;

    if (Boolean(getFavorites.length)) {
      getAllFavorites = await findAll("favorite_groups");

      textContent = getAllFavorites.map(
        (item: { groupUrl: string }) => item.groupUrl
      );
    }

    await page.goto("https://www.facebook.com/groups/feed/");
    await page.locator("html").click();

    if (!Boolean(getFavorites.length)) {
      textContent = await page.evaluate(() => {
        const pinnedGroups = Array.from(
          document.querySelectorAll(
            ".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xurb0ha.x1sxyh0 a.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1lliihq i"
          )
        ) as HTMLElement[];

        const allLinks: string[] = pinnedGroups.map((e) => parent(e));

        function parent(element: any): string {
          if (element.nodeName.toLowerCase() === "a") {
            return element.href;
          }

          return parent(element.parentElement);
        }

        const newLinks: string[] = allLinks.slice(0, 10);
        return newLinks;
      });

      const groupUrls = textContent.map((item: string) => ({ groupUrl: item }));

      await insertMany("favorite_groups", groupUrls);

      const indexes: any = await findOne("post_index");

      !Boolean(indexes.length)
        ? await insertMany("post_index", [{ i: 0, j: 0, k: 0, l: 0 }])
        : await changeOne("post_index");
    }

    console.log(textContent);

    let i = 0;
    let j = 0;
    let k = 0;
    let l = 0;

    try {
      const indexes: any = await findOne("post_index");

      if (Boolean(indexes.length)) {
        i = indexes[0].i;
        j = indexes[0].j;
        k = indexes[0].k;

        if (i === urlArray.length - 1) {
          i = 0;
        }

        if (j === textContent.length - 1) {
          j = 0;
        }

        l = 34 - l;

        console.log(i, j, k, l, urlArray.length, textContent.length);

        for (i; i <= urlArray.length - 1; i++) {
          for (j; j <= textContent.length - 1; j++) {
            await page.goto(textContent[j], { waitUntil: "domcontentloaded" });
            page.setDefaultNavigationTimeout(700000);

            await page
              .locator("div.xi81zsa.x1lkfr7t.xkjl1po.x1mzt3pk.xh8yej3.x13faqbe")
              .click();

            await page.locator("div._5rpb > div > div > div > div").click();

            await page.type(
              "div._5rpb > div > div > div > div",
              "Se vende en la Ciudad de Quito (dar click en el link): " +
                urlArray[i],
              {
                delay: 100,
              }
            );

            await sleep(4000);

            await page
              .locator(
                "div.x1l90r2v.xyamay9.x1n2onr6 > div:nth-child(3) > div > div > div > div.x6s0dn4.x78zum5.xl56j7k.x1608yet.xljgi0e.x1e0frkt"
              )
              .click();

            const randomness =
              Math.random() * (Math.floor(600000) - Math.ceil(60000)) +
              Math.ceil(60000);

            console.log(randomness);

            await sleep(randomness);

            console.log(urlArray[i], i);
            console.log(i, j, k);
            k++;

            if (k === textContent.length) {
              k === 0;
            }

            if (l === 0) {
              break;
            }

            l--;
          }
        }
      }
    } catch (e) {
      if (i < urlArray.length) i++;
      if (j < textContent.length) j++;

      await insertMany("post_index", [{ i, j, k, l }]);
      console.log("This is the error" + e);
    }
  }

  await browser.close();
})();
