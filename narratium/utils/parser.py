def parse_story(story: str):
    result = {"analysis": "", "narrative": "", "next_prompts": []}
    analysis_start = story.find("<analysis>")
    analysis_end = story.find("</analysis>")
    if analysis_start != -1 and analysis_end != -1:
        result["analysis"] = story[analysis_start + 10 : analysis_end].strip()

    narrative_start = story.find("<narrative>")
    narrative_end = story.find("</narrative>")
    if narrative_start != -1 and narrative_end != -1:
        result["narrative"] = story[narrative_start + 11 : narrative_end].strip()

    prompts_start = story.find("<next_prompts>")
    prompts_end = story.find("</next_prompts>")
    if prompts_start != -1 and prompts_end != -1:
        prompts_text = story[prompts_start + 14 : prompts_end]
        prompts = [p.strip("- ").strip() for p in prompts_text.strip().split("\n")]
        result["next_prompts"] = [p for p in prompts if p]

    return result


def parse_event(story: str):
    event_start = story.find("<event>")
    event_end = story.find("</event>")
    if event_start != -1 and event_end != -1:
        return story[event_start + 7 : event_end].strip()
    return story


def parse_character(story: str):
    result = {
        "name": "",
        "description": "",
        "personality": "",
        "background": "",
        "appearance": "",
        "skills": "",
        "location": "",
        "status": "",
    }

    name_start = story.find("<name>")
    name_end = story.find("</name>")
    if name_start != -1 and name_end != -1:
        result["name"] = story[name_start + 6 : name_end].strip()

    description_start = story.find("<description>")
    description_end = story.find("</description>")
    if description_start != -1 and description_end != -1:
        result["description"] = story[description_start + 13 : description_end].strip()

    personality_start = story.find("<personality>")
    personality_end = story.find("</personality>")
    if personality_start != -1 and personality_end != -1:
        result["personality"] = story[personality_start + 14 : personality_end].strip()

    background_start = story.find("<background>")
    background_end = story.find("</background>")
    if background_start != -1 and background_end != -1:
        result["background"] = story[background_start + 12 : background_end].strip()

    appearance_start = story.find("<appearance>")
    appearance_end = story.find("</appearance>")
    if appearance_start != -1 and appearance_end != -1:
        result["appearance"] = story[appearance_start + 12 : appearance_end].strip()

    skills_start = story.find("<skills>")
    skills_end = story.find("</skills>")
    if skills_start != -1 and skills_end != -1:
        result["skills"] = story[skills_start + 8 : skills_end].strip()

    location_start = story.find("<location>")
    location_end = story.find("</location>")
    if location_start != -1 and location_end != -1:
        result["location"] = story[location_start + 10 : location_end].strip()

    status_start = story.find("<status>")
    status_end = story.find("</status>")
    if status_start != -1 and status_end != -1:
        result["status"] = story[status_start + 8 : status_end].strip()

    return result
