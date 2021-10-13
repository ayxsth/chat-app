const socket = io();

//Elements
//naming convention for dom
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.getElementById("location");
const $messages = document.getElementById("messages");

//Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById(
    "location-message-template"
).innerHTML;

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("hh:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (message) => {
    console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format("hh:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute("disabled", "disabled");

    const message = $messageFormInput.value;

    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log("Message delivered!");
    });
});

$locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    $locationButton.setAttribute("disabled", "disabled");

    //doesn't supports promises or async-await
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            "sendLocation",
            {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            },
            () => {
                $locationButton.removeAttribute("disabled");
                console.log("Location shared!");
            }
        );
    });
});
