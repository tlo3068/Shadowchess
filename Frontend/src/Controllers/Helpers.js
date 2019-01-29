export async function myJsonify(regex, message) {
  try {
    let new_message = message.replace(regex, "");
    console.log("after regex =", new_message);
    new_message = await JSON.parse(String(new_message));
    console.log(new_message);
    return new_message;
  } catch (error) {
    console.log("Could not convert to JSON");
    console.log(message);
    return null;
  }
}
