// Load EmailJS
(function(){
    emailjs.init("6zFnZ303yp49soupx"); // your public key
})();

document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    emailjs.send("service_8ln5mu9", "template_ihpt477", {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: "sahilfact549@gmail.com"
    })
    .then(function(response){
        alert("Message sent successfully!");
        document.getElementById("contactForm").reset();
    })
    .catch(function(error){
        alert("Error: " + JSON.stringify(error));
        console.log(error);
    });
});
