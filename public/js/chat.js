const socket = io();

//naming convention for dom
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.getElementById("location");

socket.on("message", (msg) => {
    console.log(msg);
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
