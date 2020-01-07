const chai = require("chai");
const expect = chai.expect;

describe("testing", function() {
  it("testing", function() {
    var app = require("../routes/index.js");
    var value = "username";
    expect(value).to.be.a("string");
  });
});
