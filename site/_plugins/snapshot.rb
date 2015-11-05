# Creates a Liquid snapshot tag. The usage should follow:
#
#   {% snapshot path/to/photo.jpg A caption describing the photo or graphic %}
#
# Whether or not the caption is displayed depends on the layout it’s being
# called in, but it's still mandatory. It should be somewhat descriptive, so
# people using visual assistive devices are able to understand.
# ------------------------------------------------------------------------------

module Jekyll
  class SnapshotTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @attributes = text.split(' ')
    end

    def render(context)

      imgsrc   = @attributes[0]
      @attributes.shift
      caption = @attributes.join(" ")

(<<-MARKUP)
<figure class="shadow-snapshot">
  <img src="#{imgsrc}" alt="#{caption}" />
  <figcaption>
   #{caption}
  </figcaption>
</figure>
MARKUP

    end
  end
end

Liquid::Template.register_tag('snapshot', Jekyll::SnapshotTag)
