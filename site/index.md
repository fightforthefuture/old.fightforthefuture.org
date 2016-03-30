---
layout: homepage
title: "Fight for the Future, defending our basic rights and freedoms"
description: "Fight for the Future is dedicated to protecting and expanding the Internet's transformative power in our lives by creating civic campaigns that are engaging for millions of people."
---

<section class="below-the-fold" markdown="1">
{% include homepage/signup.html %}

Fight for the Future is dedicated to protecting and expanding the Internet’s transformative power in our lives by creating civic campaigns that are engaging for millions of people. Alongside internet users everywhere we beat back attempts to limit our basic rights and freedoms, and empower people to demand technology (and policy) that serves their interests. Activating the internet for the public good can only lead to a more vibrant and awesome world. More coming soon.

## Latest News

{% include homepage/recent_tweets.html %}
{% include homepage/recommended_posts.html %}

</section>
<section class="feature-content" markdown="1">

{% capture projects %}
{% include homepage/projects.md limit=15 %}
{% endcapture %}

{{ projects | markdownify }}

## As Covered By                                                        {#press}

{% for press in site.data.homepage.featuredpress.detail %}
  * > {{ press.quote }}

    [_![](/img/page/homepage/letters/{{ press.publication | truncate: 1, '' | downcase }}.png){{ press.publication | slice: 1, 100 }}_]({{ press.url }}){: target="_blank"}{% endfor %}
{:.press}

{% for press in site.data.homepage.featuredpress.list %}
  * [![{{ press.publication }}](/img/page/homepage/publications/{{ press.publication | replace: ' ', '' | downcase }}.png)]({{ press.url }}){: target="_blank"}{% endfor %}
{:.logos}

</section>
