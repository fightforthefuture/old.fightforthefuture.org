# Creates a Liquid embed_video tag. The usage should follow:
#
#   {% embed_video video_id=VIDEO video_provider=YOUTUBEorVIMEO %}

# This will embed a responsive video from YouTube or Vimeo.
# ------------------------------------------------------------------------------

module Jekyll
  class EmbedVideoTag < Liquid::Tag

    def initialize(tag_name, text, options)
      super
      @attributes = Hash.new
      args       = text.split(/\s+/).map(&:strip)
      args.each do |arg|
        key,value = arg.split('=').map(&:strip)
        if key && value
          if value =~ /^'(.*)'$/
            value = $1
          end
          @attributes[key] = value
        end
      end
    end

    def render(context)
      video_url = '#'
      if @attributes['video_provider'] == 'youtube'
        video_url = "https://www.youtube-nocookie.com/embed/#{@attributes['video_id']}?rel=0"
      elsif @attributes['video_provider'] == 'vimeo'
        video_url = "https://vimeo.com/" + @attributes['video_id']
      end

      (<<-MARKUP)
<div class="video">
  <iframe width="1280" height="720" src="#{video_url}" frameborder="0" allowfullscreen></iframe>
</div>
      MARKUP

    end
  end
end

Liquid::Template.register_tag('embed_video', Jekyll::EmbedVideoTag)
