"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const fs = require("fs-extra");

const badge =
  "[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)";

describe("generator-semantic-release:app", () => {
  it("creates .releaserc", () => {
    return helpers.run(path.join(__dirname, "../generators/app")).then(() => {
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

  it("updates existing .releaserc", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .inTmpDir(dir => {
        fs.writeJson(path.join(dir, ".releaserc"), { branches: ["master"] });
      })
      .then(dir => {
        assert.file(path.join(dir, ".releaserc"));
        assert.jsonFileContent(".releaserc", {
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
    it("updates with a button when there is no button", () => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .inTmpDir(dir => {
          fs.writeFile(path.join(dir, "README.md"), "content");
        })
        .then(dir => {
          assert.file(path.join(dir, "README.md"));
          assert.fileContent("README.md", badge);
          assert.fileContent("README.md", "content");
        });
    });

    it("does not create a README.md", () => {
      return helpers.run(path.join(__dirname, "../generators/app")).then(() => {
        assert.noFile("README.md");
      });
    });

    it("leaves well alone if there is already a button", () => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .inTmpDir(dir => {
          fs.writeFile(path.join(dir, "README.md"), badge);
        })
        .then(dir => {
          assert.file(path.join(dir, "README.md"));
          assert.equalsFileContent("README.md", badge);
        });
    });
  });
});
