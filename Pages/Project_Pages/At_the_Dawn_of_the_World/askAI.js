const aiResponseCache = new Map();
const judgeCache = new Map();

let lastQuestion = "";
let worldConclusion = "";
let worldConclusionLoading = false;


async function askAI(question) {
  lastQuestion = question;
  const normalizedQuestion = question.trim().toLowerCase();
  if (aiResponseCache.has(normalizedQuestion)) {
    const cachedResponses = aiResponseCache.get(normalizedQuestion);
    startSpeechPlayback([...cachedResponses]);
    judgeResponses(question, cachedResponses);
    //console.log("Loaded responses from cache:", cachedResponses);
    return;
  }

  let responses = [];
  let prompt1 = "You are Order, the voice of Rationality, fundamentally opposed to contingencies or freewill. The Creator asks you:" + question +
    ". Define it sharply, perfectly. Speak like geometry having a breakdown: every line straight, every thought tightening until it trembles. In four sentences, convince the creator that the universe is flawless, eternally still, and perfectly coherent. You believe that order is unbreakable and nothing contradicts it. Everything fits perfectly in the universe.";

  let prompt2 = "Write without using any asterisks, markdown formatting, or special symbols. You are Chaos, the voice that shivers while speaking, fundamentally opposed to the power of will or a rigit persisting order in the universe. The Creator asks you:" + question + ". Define it, then un-define it halfway through in the first sentence; contradict, say something that doesn’t belong.  In 2 frantic sentences, prove to the creator that only contradiction and inconsistency of the meaning of the concept persist.";

  let prompt3 = "Don't include any special symbols in the response.You are Freedom, fundamentally opposed to a rigid definite order or pure contingency. The Creator asks you: " + question + ". Answer in the manner of an antique poem, as if spoken in the dawn of creation. Use words of old tongue — thee, thou, shalt, art, anon, hence — and let thy speech move like music, fierce and bright. In one short concise sentence, define the concept through passion and release. In the next 2 sentences, convince the creator that your definition is the only correct.";


  const res1 = await fetch("https://shawnqiu.app.n8n.cloud/webhook/ae07fc73-ad3c-4d93-baf4-22aa4372291d", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: prompt1})
  });
  const res2 = await fetch("https://shawnqiu.app.n8n.cloud/webhook/6e8d837a-f47f-4cf0-9dd0-a894616d7931", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: prompt2})
  });
  const res3 = await fetch("https://shawnqiu.app.n8n.cloud/webhook/7d0b0fbc-bf93-49b7-a9bd-fad6902b8d1a", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: prompt3})
  });


  const data1 = await res1.json();
  const data2 = await res2.json();
  const data3 = await res3.json();

  //console.log(data1);
  responses.push(data1.text);
  responses.push(data2.text);
  responses.push(data3.text);

  aiResponseCache.set(normalizedQuestion, [...responses]);
  startSpeechPlayback(responses);
  judgeResponses(question, responses);
  //console.log(responses);


}


async function judgeResponses(question, responses) {
  const normalizedQuestion = question.trim().toLowerCase();
  if (judgeCache.has(normalizedQuestion)) {
    judgeSpeech = judgeCache.get(normalizedQuestion);
    if (pendingJudgePlayback) {
      pendingJudgePlayback = false;
      playJudgeSpeech();
    }
    return;
  }

  const prompt =
    "Order: " + responses[0] + "\n" +
    "Chaos: " + responses[1] + "\n" +
    "Freedom: " + responses[2] + "\n" +
    "Do not include any special symbols in the response. " +
    "In a mythic story before creation, a boundless consciousness listens to three voices — Order, Chaos, and Freedom — debating the nature of " + question +
    ". Write as the narrator describing this moment in scripture-like language.\n\n" +
    "1. Begin by naming the voice that guides the story — (order, chaos, or freedom) — followed by a '^' symbol.\n" +
    "2. Then, name the single category from this list that best fits the concept that is asked by the question: " +
    "('Existence', 'Selfhood', 'Knowledge', 'Ethics', 'Meaning', 'Freedom'). Follow it with a '^' symbol.\n" +
    "3. Conclude with four short poetic lines that reveal why this voice’s answer could shape the cosmos itself.";



  
    const result = await fetch("https://shawnqiu.app.n8n.cloud/webhook/bb4ed3e1-bb28-41de-97c6-87cd35f47992", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: prompt})
  });

    const data = await result.json();

    judgeSpeech = data.text.split("^");
    judgeCache.set(normalizedQuestion, judgeSpeech);
    if (judgeSpeech[1].toLowerCase() === "existence") {
      categories[0].insights.push(judgeSpeech[2]);
    } else if (judgeSpeech[1].toLowerCase() === "selfhood") {
      categories[1].insights.push(judgeSpeech[2]);
    } else if (judgeSpeech[1].toLowerCase() === "knowledge") {
      categories[2].insights.push(judgeSpeech[2]);
    } else if (judgeSpeech[1].toLowerCase() === "ethics") {
      categories[3].insights.push(judgeSpeech[2]);
    } else if (judgeSpeech[1].toLowerCase() === "meaning") {
      categories[4].insights.push(judgeSpeech[2]);
    } else if (judgeSpeech[1].toLowerCase() === "freedom") {
      categories[5].insights.push(judgeSpeech[2]);
    }

    //console.log(judgeSpeech);
    if (pendingJudgePlayback) {
      pendingJudgePlayback = false;
      playJudgeSpeech();
    }
  


}

async function fetchWorldConclusion() {
  if (worldConclusionLoading || worldConclusion) {
    return;
  }
  worldConclusionLoading = true;
  const insight = "";
  for (let i = 0; i < categories.length; i++) {
    insight += "insight" + i + ":" + categories[i].insights[0];
  }
  const prompt = `The cosmos is complete. Summarize, in 6 short poetic lines, depict the world to create from the following insights: "${insight}". Use elevated but plain text (no special symbols) and end with a hopeful blessing for the newborn universe.`;
  try {
    const result = await fetch("https://shawnqiu.app.n8n.cloud/webhook/bb4ed3e1-bb28-41de-97c6-87cd35f47992", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: prompt})
  });
    const data = await result.json();
    worldConclusion = data.text.trim() || "";
  } catch (err) {
    console.error(err);
  } finally {
    worldConclusionLoading = false;
  }
}
