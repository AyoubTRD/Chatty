const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element);
$$("form").forEach(form => {
  form.addEventListener("submit", e => e.preventDefault());
});
let name = localStorage.getItem("name");

if (name) $(".name").remove();
else {
  $(".name").addEventListener("submit", () => {
    if ($(".name").name.value) {
      localStorage.setItem("name", $(".name").name.value);
      name = localStorage.getItem("name");
      $(".name").remove();
    }
  });
}

const showMessages = (message, id) => {
  let ownerClass = "";
  let owner = message.author;
  if (message.author == name) {
    ownerClass = "own-message";
    owner = "Me";
  }
  let when = dateFns.distanceInWordsToNow(message.time.toDate(), {
    addSuffix: true
  });
  let html = `
  <li class="px-4 my-2 ${ownerClass}" data-id="${id}">
    <span class="author pt-2 d-block">${owner}</span>
    <p class="text mb-0">${message.text}</p>
    <div class="pb-2 time">${when}</div>
  </li>
  `;
  $("ul").innerHTML += html;
};

const sendMessage = text => {
  const now = new Date();
  const message = {
    author: name,
    text: text,
    time: firebase.firestore.Timestamp.fromDate(now)
  };
  db.collection("messages").add(message);
};

db.collection("messages")
  .orderBy("time")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type == "added") {
        showMessages(change.doc.data(), change.doc.id);
      }
    });
  });

$(".message").addEventListener("submit", () => {
  if ($(".message").text.value && name) {
    sendMessage($(".message").text.value);
    $(".message").text.value = "";
  }
});
