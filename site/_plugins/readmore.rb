# Creates a Liquid readmore tag. The usage should follow:
#
#   {% readmore Teaser Text %}
#     The text that is to be expanded. May be several paragraphs—that's okay!
#   {% endreadmore %}
#
# The Teaser Text would likely be something such as "Expand text" or "Keep
# reading". (you do not need quotes, i was just being illustrative.)
# ------------------------------------------------------------------------------

module Jekyll
  class MoreTag < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      text = super
      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
(<<-MARKUP)
<button class=\"expand-text\">#{@text}</button>
<div class=\"expanded-text\">
  #{converter.convert(text)}
</div>
MARKUP
    end
  end
end

Liquid::Template.register_tag('readmore', Jekyll::MoreTag)
