fetch("/api/hello")
  .then((x) => x.json())
  .then((x) =>
    document.body.append(
      (document.createElement("p").innerText = "API says: " + x.message)
    )
  );
