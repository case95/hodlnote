import coinbaseApi from "./coinbaseApi";

const apiCall = async () => {
  try {
    const res = await coinbaseApi().get("products");
    console.log(`%cPAIRS: `, "background: #222; color: #bada55", res);
  } catch (err) {
    window.alert("ERROR: " + err);
  }
};

export default apiCall;
