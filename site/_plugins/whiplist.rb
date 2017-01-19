# Creates a Liquid whip list tag. The usage should follow:
#
#   {% snapshot path/to/photo.jpg A caption describing the photo or graphic %}
#
# Whether or not the caption is displayed depends on the layout it’s being
# called in, but it's still mandatory. It should be somewhat descriptive, so
# people using visual assistive devices are able to understand.
# ------------------------------------------------------------------------------
require 'json'
require 'yaml'
require 'open-uri'
require 'digest/md5'

module Jekyll
  class WhipListTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super

      id = Digest::MD5.hexdigest(text.to_s)
      @attributes = JSON.parse(text.to_s)
      @attributes["id"] = id
    end

    def render(context)

      states = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District Of Columbia",
        "FM": "Federated States Of Micronesia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MH": "Marshall Islands",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "MP": "Northern Mariana Islands",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PW": "Palau",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VI": "Virgin Islands",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
      }

      congress = YAML.load_file('site/_data/congress.yml')

      id = @attributes["id"]

      if @attributes.has_key?("targets")
        targets = @attributes['targets']
      else
        targets = []
      end

      if @attributes.has_key?("class")
        class_name = @attributes["class"]
      else
        class_name = ""
      end

      whip = []

      congress.each do |person|

        if targets.length > 0

          found_target = false

          targets.each do |target|

            if target["bioguide"] == person["bioguide"]
              found_target = true

              target.each do |key, val|
                person[key] = val
              end
            end

          end

          next if found_target == false

        end

        if @attributes.has_key?("organization")
          next if person["organization"].downcase != @attributes['organization'].downcase
        end

        whip.push(person)

      end

      sort_html = ""

      if @attributes.has_key?("sortable") && @attributes["sortable"] == true
        sort_html = "<div id=\"sort_" + id + "\" class=\"whip-sort\"></div>"
      end

      html = <<-HTML
#{sort_html}
<ul class="whip #{class_name}" id="#{id}">
      HTML

      whip.each do |person|

        person_class = case person[@attributes["target_legislation"]].downcase
          when 'good'
            'good'
          when 'bad'
            'bad'
          else
            'neutral'
        end

        img_src = "https://s3.fightforthefuture.org/congress/" + person["imagepleasedontedit"]

        if person.has_key?(person_class + "_text")
          position_text = person[person_class + "_text"]
        else
          position_text = @attributes[person_class + "_text"]
        end

        if person["organization"].downcase == "senate"
          position_text = position_text.gsub("\{TITLE\}", "Sen. ")
        elsif person["organization"].downcase == "house"
          position_text = position_text.gsub("\{TITLE\}", "Rep. ")
        else
          position_text = position_text.gsub("\{TITLE\}", "")
        end

        if person["gender"].downcase == "f"
          position_text = position_text.gsub("\{GENDER_POSSESSIVE\}", "her")
        elsif person["gender"].downcase == "m"
          position_text = position_text.gsub("\{GENDER_POSSESSIVE\}", "his")
        else
          position_text = position_text.gsub("\{GENDER_POSSESSIVE\}", "their")
        end

        position_text = position_text.gsub("\{LASTNAME\}", person["name"])

        affiliation_text = ""

        if person["affiliation_text"]
          affiliation_text = person["affiliation_text"]
        elsif person["state"]
          states.each do |abbreviation, full|
            if person["state"].downcase == full.downcase
              if person["partyaffiliation"] && !person["partyaffiliation"][0].nil
                affiliation_text += "(" + person["partyaffiliation"][0].upcase + "-" + abbreviation.to_s + ")"
              end
            end
          end
        end

        phone_html = ""

        if person["phone"]
          phone_number = person["phone"].gsub(/[\(\)\s-]/, "")
          phone_text = phone_number[0,3] + "-" + phone_number[3,3] + "-" + phone_number[6,4]
          phone_html = "<a href=\"tel://1" + phone_number + "\" "
          phone_html += "class=\"phone\">" + phone_text + "</a>"
        end

        twitter_html = ""

        if person["twitter"] != ""
          twitter_html = "<a href=\"https://twitter.com/intent/tweet?text="

          if person["tweet_text"]
            tweet_text = person["tweet_text"]
          elsif @attributes.has_key?("tweet_text")
            tweet_text = @attributes["tweet_text"]
          else
            tweet_text = ".@" + person["twitter"]
          end

          tweet_text = tweet_text.gsub("\{USERNAME\}", "@"+person["twitter"])
          tweet_text = URI::encode(tweet_text)

          twitter_html += tweet_text + "\" target=\"_blank\" class=\"tweet\">@"
          twitter_html += person['twitter'] + "</a>"

        end

        email_html = ""

        if person["email"] != ""
          if person["email"].include? "@"
            email_url = "mailto:" + person["email"]
            email_text = person["email"]
          else
            email_url = person["email"]
            email_text = "Email"
          end

          email_html = "<a href=\"" + email_url + "\">" + email_text + "</a>"
        end

        bill_name_html = ""

        if @attributes.has_key?("bill_name")
          if person_class == 'good'
            vote_mark = "✔"
          elsif person_class == 'bad'
            vote_mark = "✖"
          else
            vote_mark = "?"
          end

          bill_name_html = "<div class=\"bill-name\">" + @attributes["bill_name"] + " <span class=\"vote-mark\">#{vote_mark}</span></div>"
        end

        html += <<-HTML
<li class="#{person_class}">
  <div style="background-image:url(#{img_src});" class="photo"></div>
  <h4>#{person["first"]} #{person["name"]} <strong>#{affiliation_text}</strong></h4>
  <div class="details">
    #{bill_name_html}
    <div class="position">#{position_text}</div>
    <div class="links">
      <div>#{phone_html}</div>
      <div>#{twitter_html}</div>
      <div>#{email_html}</div>
    </div>
  </div>
  <input type="hidden" name="lastname" value="#{person["name"]}" />
  <input type="hidden" name="state" value="#{person["state"]}" />
</li>
        HTML


      end

      html += <<-HTML
</ul>
      HTML

      (<<-MARKUP)
#{html}
      MARKUP

    end
  end
end

Liquid::Template.register_tag('whiplist', Jekyll::WhipListTag)
