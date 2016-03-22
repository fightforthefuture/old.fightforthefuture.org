---
layout: classic
header: true
title: Fight for the Future in the press
class: press
---

## Press

If you are a member of the press and wish to contact us, please email [press@fightforthefuture.org](mailto:press@fightforthefuture.org) or call [(508) 368-3026](tel://15083683026).
{: .contact }

{% for campaign in site.data.press %}
<h3 id="{{ campaign.campaign }}">{{ campaign.pretty }}</h3>
<ul class="presslist">
  {% for article in campaign.coverage %}<li><a href="{{ article.link }}">{{ article.title }}</a> {{ article.date | date: '%B %d, %Y' }}. {{ article.publication }}</li>{% endfor %}
</ul>
{% endfor %}
