function simpleCheck(form) {
    const pwd1 = document.querySelector("#pwd1");
    const pwd2 = document.querySelector("#pwd2");
    if (pwd1.value !== pwd2.value) {
        alert("Password double check failed!");
        return false;
    } else {
        pwd2.value = "";
        return true;
    }
}