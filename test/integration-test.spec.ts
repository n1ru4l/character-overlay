import Docker from "dockerode";
import fetch from "node-fetch";
import puppeteer from "puppeteer";
import type { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";

let docker: Docker;
let browser: Browser;
let container: Docker.Container;

beforeAll(async () => {
  docker = new Docker();
  browser = await puppeteer.launch();
  container = await docker.createContainer({
    Tty: false,
    Image: "n1ru4l/character-overlay",
    ExposedPorts: {
      "4000/tcp": {},
    },
    HostConfig: {
      PortBindings: {
        "4000/tcp": [
          {
            HostPort: "4000",
          },
        ],
      },
    },
  });

  await container.start();
  await new Promise((resolve) => setTimeout(resolve, 10000));
}, 20000);

afterAll(async () => {
  await container.stop();
  await container.remove();
  await browser.close();
});

test("app is running", async () => {
  const res = await fetch("http://127.0.0.1:4000", {});
  expect(res.status).toEqual(200);
});

test("app looks good", async () => {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto("http://127.0.0.1:4000", { waitUntil: "networkidle2" });
  await page.screenshot({ path: "image.png" });
});
