const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const figlet = require("figlet");

figlet(
  "platform",
  {
    horizontalLayout: "full",
    verticalLayout: "default",
  },
  function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  },
);
