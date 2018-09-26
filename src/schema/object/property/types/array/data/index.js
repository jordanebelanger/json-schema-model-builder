const arrays = {
  "numberOfChildren": {
    "description": "Children parented",
    "type": "array",
    "items": [
      {
        "type": "number",
        name: "childCount",
        "enum": [0, 1, 2]
      }
    ]
  }
}

module.exports = {
  arrays
}
