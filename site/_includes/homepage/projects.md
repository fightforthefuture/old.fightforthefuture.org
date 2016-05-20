## Our Projects                                                      {#projects}

{% for project in site.data.homepage.fftf %}
  ![{{ project.title }}]({{ project.image }})
  : ### [{{ project.title }}]({{ project.url }})

    {{ project.description }}
  {% if project.fire %}{:.fire}{% endif %}

  ---
{% if forloop.index == include.limit  %}{% break %}
{% endif %}{% endfor %}

![Other Links](/img/projects/ol.png)
: {% for link in site.data.homepage.otherlinks %}
    * [{{ link.text }}]({{ link.url }}){% endfor %}
{:.other}

{% unless include.limit %}[See more projects...](/projects){:.morelink}{% endunless %}

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

