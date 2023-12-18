"use strict";
// Const path = require("path");
import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import fs from "fs-extra";

// Const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import app from "../generators/app";

const badge =
  "[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)";

describe("generator-semantic-release:app", () => {
  /*  BeforeEach(async () => {
    runResult = await helpers.create("app", {},{})
  })
  */
  it("creates .releaserc", async () => {
    return helpers
      .create(app, {}, {})
      .run()
      .then(() => {
        assert.file([".releaserc"]);
        assert.jsonFileContent(".releaserc", {
          plugins: [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            "@semantic-release/changelog",
            "@semantic-release/git"
          ]
        });
      });
  });

  it("updates existing .releaserc", async () => {
    return helpers
      .create(app, {}, {})
      .withPrompts({})
      .inTmpDir(dir => {
        fs.writeJson(path.join(dir, ".releaserc"), { branches: ["master"] });
      })
      .run()
      .then(runResult => {
        runResult.assertFile(".releaserc");
        // Assert.file(path.join(dir, ".releaserc"));
        runResult.assertJsonFileContent(".releaserc", {
          branches: ["master"],
          plugins: [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            "@semantic-release/changelog",
            "@semantic-release/git"
          ]
        });
      });
  });

  describe("handles readme", () => {
    it("updates with a button when there is no button", async () => {
      return helpers
        .create(app, {}, {})
        .inTmpDir(dir => {
          fs.writeFile(path.join(dir, "README.md"), "content");
        })
        .run()
        .then(runResult => {
          /*
          RunResult.inTmpDir((dir) => {
            fs.writeFile(path.join(dir, "README.md"), "content");
          })
          */
          runResult.assertFile("README.md");
          runResult.assertFileContent("README.md", badge);
          runResult.assertFileContent("README.md", "content");
          //   });
        });
    });

    it("does not create a README.md", async () => {
      return helpers
        .create(app, {}, {})
        .run()
        .then(runResult => {
          runResult.assertNoFile("README.md");
        });
    });

    it("leaves well alone if there is already a button", async () => {
      return helpers
        .create(app, {}, {})
        .inTmpDir(dir => {
          fs.writeFile(path.join(dir, "README.md"), badge);
        })
        .run()
        .then(runResult => {
          runResult.assertFile("README.md");
          runResult.assertEqualsFileContent("README.md", badge);
        });
    });
  });
});
