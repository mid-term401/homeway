import TweetEmbed from "react-tweet-embed";

export default function Tweets() {
  return (
    <>
      <TweetEmbed id="1400733691417186304" options={{theme: 'dark' }}/>
      <TweetEmbed id="1400733691417186304" options={{cards: 'hidden' }}/>
      <TweetEmbed id="1398969802555760642" />
      <TweetEmbed id="1398969802555760642" options={{cards: 'hidden' }}/>
      {/* https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference */}
    </>
  );
}