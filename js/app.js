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

setTimeout(() => Notification.requestPermission(), 7000);

const showMessages = (message, id) => {
  let ownerClass = "";
  let owner = message.author;
  if (message.author == name) {
    ownerClass = "own-message";
    owner = "Me";
  }
  const messageNotification = new Notification(
    message.author + " sent a message!"
  );

  let html = `
  <li class="px-4 my-2 ${ownerClass}" data-id="${id}">
    <span class="author pt-2 d-block">${owner}</span>
    <p class="text pb-2">${message.text}</p>
  </li>
  `;
  $("ul").innerHTML += html;
};

const sendMessage = text => {
  const time = new Date();
  const message = {
    author: name,
    text: text,
    time: time.getTime()
  };
  db.collection("messages").add(message);
};

db.collection("messages").onSnapshot(snapshot => {
  snapshot.docChanges().sort((a, b) => a.doc.data().time - b.doc.data().time);
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

