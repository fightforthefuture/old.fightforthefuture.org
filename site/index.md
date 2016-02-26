---
layout: homepage
title: "Fight for the Future, defending our basic rights and freedoms"
description: "Fight for the Future is dedicated to protecting and expanding the Internet's transformative power in our lives by creating civic campaigns that are engaging for millions of people."
---

## Our Projects                                                      {#projects}

{% for project in site.data.homepage.fftf %}{% if forloop.index0 < 15 %}
  ![{{ project.title }}]({{ project.image }})
  : ### [{{ project.title }}]({{ project.url }})

    {{ project.description }}
  {% if project.fire %}{:.fire}{% endif %}

  ---
{% endif %}{% endfor %}

![Other Links](/img/projects/ol.png)
: {% for link in site.data.homepage.otherlinks %}
    * [{{ link.text }}]({{ link.url }}){% endfor %}
{:.other}

[See more projects...](/projects){:.morelink}

## [Fight for the Future Education Fund](https://www.fftfef.org) (our related 501(c)3)

{% for project in site.data.homepage.fftfef %}
  ![{{ project.title }}]({{ project.image }})
  : ### [{{ project.title }}]({{ project.url }})

    {{ project.description }}
  {% if project.fire %}{:.fire}{% endif %}

  ---
{% endfor %}

![Other Links](/img/projects/ol.png)
: {% for link in site.data.homepage.otherlinksc3 %}
    * [{{ link.text }}]({{ link.url }}){% endfor %}
{:.other}

## As Covered By

{% for press in site.data.homepage.featuredpress.detail %}
  * > {{ press.quote }}

    [_![](/img/page/homepage/letters/{{ press.publication | truncate: 1, '' | downcase }}.png){{ press.publication | slice: 1, 100 }}_]({{ press.url }}){: target="_blank"}{% endfor %}
{:.press}

{% for press in site.data.homepage.featuredpress.list %}
  * [![{{ press.publication }}](/img/page/homepage/publications/{{ press.publication | replace: ' ', '' | downcase }}.png)]({{ press.url }}){: target="_blank"}{% endfor %}
{:.logos}
