---
layout: homepage
title: "Fight for the Future, defending our basic rights and freedoms"
description: "Fight for the Future is dedicated to protecting and expanding the Internet's transformative power in our lives by creating civic campaigns that are engaging for millions of people."
---

Fight for the Future is dedicated to protecting and expanding the Internet's transformative power in our lives by creating civic campaigns that are engaging for millions of people. Alongside internet users everywhere we beat back attempts to limit our basic rights and freedoms, and empower people to demand technology (and policy) that serves their interests. Activating the internet for the public good can only lead to a more vibrant and awesome world. More coming soon.

## Latest News

{% include recommended_posts.html %}
{% include recent_tweets.html %}

## Our Projects                                                      {#projects}

{% for project in site.data.homepage.fftf %}
  ![{{ project.title }}]({{ project.image }})
  : ### [{{ project.title }}]({{ project.url }})

    {{ project.description }}
  {% if project.fire %}{:.fire}{% endif %}

  ---
{% endfor %}

![Other Links](homepage/images/projects/ol.png)
: {% for link in site.data.homepage.otherlinks %}
    * [{{ link.text }}]({{ link.url }}){% endfor %}
{:.other}

## [Fight for the Future Education Fund](https://www.fftfef.org) (our related 501(c)3)

{% for project in site.data.homepage.fftfef %}
  ![{{ project.title }}]({{ project.image }})
  : ### [{{ project.title }}]({{ project.url }})

    {{ project.description }}
  {% if project.fire %}{:.fire}{% endif %}

  ---
{% endfor %}

![Other Links](homepage/images/projects/ol.png)
: {% for link in site.data.homepage.otherlinksc3 %}
    * [{{ link.text }}]({{ link.url }}){% endfor %}
{:.other}

## As Covered By

{% for press in site.data.homepage.featuredpress.detail %}
  * “{{ press.quote }}”

    _![](homepage/images/letters/{{ press.publication | truncate: 1, '' | downcase }}.png){{ press.publication | slice: 1, 100 }}_{% endfor %}
{:.press}

{% for press in site.data.homepage.featuredpress.list %}
  * ![{{ press.publication }}](homepage/images/publications/{{ press.publication | replace: ' ', '' | downcase }}.png){% endfor %}
{:.logos}
