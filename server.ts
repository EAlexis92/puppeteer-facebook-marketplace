import puppeteer from "puppeteer-core";
import * as edgePaths from "edge-paths";

const EDGE_PATH = edgePaths.getEdgePath();

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe",
    headless: false,
    args: ["--start-maximized"],
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

  await page.type("#email", "eddytopete.a@hotmail.com");
  await page.type("#pass", "Alexis.1992562");
  await page.click("button");

  await page.waitForNavigation(); // The promise resolves after navigation has finished

  await page.goto("https://www.facebook.com/marketplace/you/selling/", {
    waitUntil: "domcontentloaded",
  });
  await page.locator("html").click();

  let previousHeight: any = 0;
  let newHeight: any = 1;

  while (previousHeight < newHeight) {
    previousHeight = newHeight;
    newHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

    await sleep(3000);
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await page.evaluate("window.scrollTo(0, 0)");

  const items = await page.evaluate(
    () =>
      document.querySelectorAll(
        "span.x1lliihq.x1iyjqo2 > div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w > div > div"
      ).length
  );

  const urlArray = [];

  console.log(items);

  try {
    for (let i = 1; i <= items; i++) {
      const relistItem = await page.evaluate(async (i) => {
        const selector = (await document.querySelector(
          `div:nth-child(${i}) > div > div > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xsyo7zv.x16hj40l.xexx8yu.x18d9i69 > div > div.x1daaz14 > div > div:nth-child(2) > div > div > span > div > div > div.x6s0dn4.x78zum5.xl56j7k.x1608yet.xljgi0e.x1e0frkt > div:nth-child(2) > span > span`
        )) as HTMLDivElement;

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

        // await page;
        // .locator(
        //   "div > div > div > div > div > div > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1jx94hy.xh8yej3 > div > div:nth-child(3) > div"
        // )
        // .click();

        const clipboardContent = await page.evaluate(() => {
          const text = navigator.clipboard.readText();
          return text;
        });

        await urlArray.push(clipboardContent);
      }
    }
  } catch (e) {
    console.log("This is the error: " + e);
  }

  console.log(urlArray, urlArray.length);

  await page.goto("https://www.facebook.com/groups/feed/");
  await page.locator("html").click();

  const textContent = await page.evaluate(() => {
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

    // const anchors = Array.from(
    //   document.querySelectorAll(
    //     ".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xurb0ha.x1sxyh0 a.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1lliihq"
    //   )
    // ) as HTMLAnchorElement[];
    // const allLinks = anchors.slice(1, 11).map((a) => a.href);
    // return allLinks;

    // const anchors = Array.from(pinnedGroups) as HTMLAnchorElement[];
    const newLinks: string[] = allLinks.slice(0, 10);
    return newLinks;
  });

  console.log(textContent);

  for (let i = 0; i <= textContent.length - 1; i++) {
    await page.goto(textContent[i], { waitUntil: "domcontentloaded" });
    await page.setDefaultNavigationTimeout(70000);

    for (let j = 0; j <= urlArray.length - 1; j++) {
      await page
        .locator("div.xi81zsa.x1lkfr7t.xkjl1po.x1mzt3pk.xh8yej3.x13faqbe")
        .click();

      await page.locator("div._5rpb > div > div > div > div").click();

      await page.type(
        "div._5rpb > div > div > div > div",
        "Se vende en la Ciudad de Quito (dar click en el link): " + urlArray[j],
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

      await sleep(60000);

      console.log(urlArray[j], j);
    }
  }

  await browser.close();
})();
