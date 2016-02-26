---
layout: classic
title: "Fight for the Future, defending our basic rights and freedoms"
description: "Fight for the Future is dedicated to protecting and expanding the Internet's transformative power in our lives by creating civic campaigns that are engaging for millions of people."
class: projects
---

## Our Projects                                                      {#projects}

{% for project in site.data.homepage.fftf %}
  ![{{ project.title }}]({{ project.image }})
  : ### [{{ project.title }}]({{ project.url }})

    {{ project.description }}
  {% if project.fire %}{:.fire}{% endif %}

  ---
{% endfor %}

![Other Links](/img/projects/ol.png)
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

![Other Links](/img/projects/ol.png)
: {% for link in site.data.homepage.otherlinksc3 %}
    * [{{ link.text }}]({{ link.url }}){% endfor %}
{:.other}
