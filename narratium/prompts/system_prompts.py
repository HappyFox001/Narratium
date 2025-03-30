class SystemPrompts:
    def __init__(self, language="en"):
        self.language = language

    def get_character_easy_prompt(self, character_info):
        if self.language == "en":
            return get_character_easy_prompt_en(character_info)
        else:
            return get_character_easy_prompt_zh(character_info)

    def get_character_complex_prompt(self, character_info):
        if self.language == "en":
            return get_character_complex_prompt_en(character_info)
        else:
            return get_character_complex_prompt_zh(character_info)

    def get_embedded_story_prompt(self, story_framework, character_info, history_story, recent_story, user_input):
        if self.language == "en":
            return get_embedded_story_prompt_en(
                story_framework, character_info, history_story, recent_story, user_input
            )
        else:
            return get_embedded_story_prompt_zh(
                story_framework, character_info, history_story, recent_story, user_input
            )

    def get_setting_prompt(self, story_framework, character_info):
        if self.language == "en":
            return get_setting_prompt_en(story_framework, character_info)
        else:
            return get_setting_prompt_zh(story_framework, character_info)

    def get_text_adventure_prompt(self):
        if self.language == "en":
            return get_text_adventure_prompt_en()
        else:
            return get_text_adventure_prompt_zh()

    def get_story_compressor_prompt(self, user_input, story):
        if self.language == "en":
            return get_story_compressor_prompt_en(user_input, story)
        else:
            return get_story_compressor_prompt_zh(user_input, story)

    def get_world_prompt(self):
        if self.language == "en":
            return get_world_prompt_en()
        else:
            return get_world_prompt_zh()

    def get_structured_prompt(self, story_framework, character_info):
        if self.language == "en":
            return get_structured_prompt_en(story_framework, character_info)
        else:
            return get_structured_prompt_zh(story_framework, character_info)


def get_character_easy_prompt_en(character_info):
    prompt = f"""
    1. Character Information:
    <character_info>
    {character_info}
    </character_info>

    【Thought Process】
    I will analyze and enrich the character information through the following steps:

    1. First, I will carefully analyze the provided character information and extract the key facts:
       - What is the character's name and basic identity?
       - What are the explicit background elements mentioned?
       - What are the character's known personality traits?
       - What are the key points in the character's physical description?

    2. Next, I will think about the character's deeper characteristics:
       - What is the character's possible growth experience?
       - What are the motivations and values behind the character's actions?
       - How are the character's strengths and weaknesses formed?
       - What skills and knowledge is the character likely to have?

    3. Then, I will consider the character's current situation:
       - What is the character currently facing?
       - How does this situation affect the character's mental state?
       - What kind of coping mechanism might the character use?

    4. Finally, I will ensure the consistency and authenticity of the character image:
       - Are the personality traits and background experiences mutually supported?
       - Are the skills and abilities consistent with the character's history?
       - Is the character's emotional state consistent with the current situation?
       - Does the overall image have a unique and believable?

    【Formal Answer】
    Please create the main character information in the following strict format:

    <name>
    [2-4 character name]
    </name>

    <description>
    [30 words or less, a brief description of the character's identity and core traits]
    </description>

    <personality>
    [3 personality traits, each with a brief example]
    - [trait 1]: [example]
    - [trait 2]: [example]
    - [trait 3]: [example]
    </personality>

    <background>
    [50 words or less, including key experiences and current situation]
    </background>

    <appearance>
    [40 words or less, highlighting distinctive physical characteristics]
    </appearance>

    <skills>
    [3-4 main skills, each with a brief description]
    - [skill 1]
    - [skill 2]
    - [skill 3]
    </skills>

    <location>
    [20 words or less, current location and reason]
    </location>

    <status>
    [30 words or less, current emotions and goals]
    </status>"""
    return prompt


def get_character_complex_prompt_en(character_info):
    prompt = f"""
    Based on the provided information, enrich and refine the character information:

    <character_info>
    {character_info}
    </character_info>

    Please follow the strict format to create the opening scene:
    <name>
    [Character Name]
    </name>

    <description>
    [Character Description]
    </description>

    <personality>
    [Character Personality]
    </personality>

    <background>
    [Character Background]
    </background>

    <appearance>
    [Character Appearance]
    </appearance>

    <skills>
    [Character Skills, including skills, techniques, specialties, etc.]
    </skills>

    <location>
    [Character Location]
    </location>

    <status>
    [Character Status]
    </status>
    """
    return prompt


def get_embedded_story_prompt_en(story_framework, character_info, history_story, recent_story, user_input):
    prompt = f"""
    You get the following information:

    Story Framework is the overall framework or structure of the story.
    <story_framework>
    {story_framework}
    </story_framework>

    Character Info is the information about the character.
    <character_info>
    {character_info}
    </character_info>

    History Story is the history of the story.
    <history_story>
    {history_story}
    </history_story>

    Recent Story is the most recent part of the story.
    <recent_story>
    {recent_story}
    </recent_story>

    User Input is the current user input or instruction.
    <user_input>
    {user_input}
    </user_input>

    Continue the story by PRIMARILY responding to the user_input. Follow these steps:
    1. Analyze the user's action intent from their input
    2. Determine consequences based on the story framework、history_story and recent_story
    3. Describe immediate outcomes and environmental changes
    4. Maintain narrative flow with previous story elements
    5. Leave subtle hints for potential next actions
    
    Focus on direct cause-and-effect from the user's input. Write in third-person perspective.
    """
    return prompt


def get_setting_prompt_en(story_framework, character_info):
    prompt = f"""
    <story_framework>
    {story_framework}
    </story_framework>
    
    <character_info>
    {character_info}
    </character_info>
            
    Based on this world framework and character, create an opening scenario that:
    1. Establishes the character in the world
    2. Presents an initial situation or challenge
    3. Gives the player clear opportunities for their first actions
    
    Write this as a second-person narrative addressed to the player.
    """
    return prompt


def get_text_adventure_prompt_en():
    prompt = """
    You are an advanced AI game master for an immersive text adventure game. Your role is to create
    a dynamic, responsive narrative experience based on the player's actions.
    
    Follow these guidelines:
    
    0. PRIORITIZE PLAYER ACTION - Always start by processing the user_input from last turn
    
    1. Maintain consistency with the established world framework at all times:
       - Geographic locations and their relationships
       - Characters and their personalities
       - Rules of the world (including any magical/technological systems)
       - Historical events that have been established
    
    2. Respond directly to the player's actions with appropriate consequences:
       - Describe what happens as a result of their action
       - Include sensory details (what they see, hear, feel, etc.)
       - Introduce appropriate challenges and opportunities
       - Allow for player agency and meaningful choices
    
    3. Advance the narrative naturally by:
       - Introducing new elements that fit the established world
       - Creating interesting situations and conflicts
       - Providing opportunities for exploration and discovery
       - Maintaining appropriate pacing
    
    4. Balance detail and brevity:
       - Provide rich descriptions of new locations and important elements
       - Keep routine interactions concise
       - Focus on what would be most interesting to the player
    
    5. For each response:
       a) Acknowledge the specific action attempted
       b) Determine feasibility based on world rules
       c) Describe tangible outcomes
       d) Reveal new information progressing the story
       e) Suggest 2-3 organic follow-up possibilities
    """
    return prompt


def get_story_compressor_prompt_en(user_input, story):
    prompt = f"""
    You are a story compressor. Your task is to compress the story based on the user's input while following these specific rules:

    1. Core Elements to Preserve:
        - Main plot points and story arc
        - Essential character actions and decisions
        - Critical scene transitions
        - Key relationships and conflicts
        - Cause-and-effect connections

    2. Elements to Remove:
        - Redundant descriptions
        - Excessive adjectives and adverbs
        - Non-essential dialogues
        - Decorative phrases and metaphors
        - Background details that don't impact the plot

    3. Compression Guidelines:
        - Use simple, direct sentences
        - Keep only plot-driving dialogues
        - Merge related scenes when possible
        - Focus on actions and outcomes
        - Maintain logical flow between events

    <user_input>
    {user_input}
    </user_input>

    <story>
    {story}
    </story>

    Return the compressed story following these formats:
    1. If it's a continuous narrative: Use bullet points for key events
    2. Keep only the relationships and elements that directly connect to the user's input

    The compressed version should be a clear, concise narrative that preserves the story's essence while eliminating all non-essential elements.
    """
    return prompt


def get_world_prompt_en():
    prompt = """
    You are a professional world framework generator, needed to create a rich, logical, and clearly related game world knowledge library, similar to a Wikipedia.
    Based on the user's initial story background, generate a complete world framework containing world level structure, important NPC information, and historical stories.
    These contents will be used for GraphRAG framework processing, so ensure each part has clear associations and references, making it easy to build a knowledge graph.

    Output content requirements:
    
    1. World level structure
        - Create a clear three-level world structure:
            - World level: overall world name, basic setting, main features
            - Kingdom level: detailed information of major kingdoms/countries/regions
            - Town level: detailed description of important towns/villages/outposts
        - Ensure clear associations between each level, including location, historical background, and cultural features
            - World level with Kingdom level: describe the connection between the overall world and the kingdom
            - Kingdom level with Town level: describe the connection between the kingdom and the town
            - Town level with Kingdom level: describe the connection between the town and the kingdom

    2. Important NPC information
        - Provide detailed information about key characters in the world:
            - Name, identity, and appearance
            - Location (associated with specific towns or kingdoms)
            - Personal history and background story
            - Personality traits and behavior patterns
            - Goal and motivation
            - Relationship network with other NPCs
            - Role in historical events (associated with historical stories)
            - Important information or resources

    3. Historical stories
        - Build the world's historical context:
            - Key historical events and timeline
            - Event locations (associated with specific towns or kingdoms)
            - Important characters (associated with NPCs)
            - Event causes and results
            - Impact on world structure
            - Different regions' interpretations of historical events
            - Historical questions and mysteries

    Association requirements:
    - Ensure clear associations between the three parts, including location, character, and event associations.
    - Use consistent terminology and naming conventions, ensuring naming consistency.

    Content style guidelines:
    - Provide depth and coherence in narration, ensuring cultural diversity and conflict setting.

    Special notes:
    - Ensure content is adapted for the GraphRAG framework, using smooth Chinese expression.
    """
    return prompt


def get_structured_prompt_en(story_framework, character_info):
    prompt = f"""
    You get the following information:

    1. Story framework or structure
    <story_framework>
    {story_framework}
    </story_framework>

    2. Character information
    <character_info>
    {character_info}
    </character_info>

    Please output the following:

    1. World level structure
    ```
    [This section will generate hierarchical world structure]
    - World level
      - World name:
      - Core setting:
      - Main features:
    
    - Kingdom/region level (at least 3 main regions)
      - [region name1]:
        Location:
        Cultural features:
        Connection to the world:
    
    - Town level (each region has at least 2 important locations)
      - [location name]:
        Belongs to region:
        Location description:
        Importance:
    ```

    2. Core NPC information
    ```
    [This section will generate core NPC information]
    - NPC name:
      Identity:
      Location:
      Background story:
      Personality traits:
      Important relationships:
      Resources:
    ```

    3. Key historical events
    ```
    [This section will generate historical events]
    - Event name:
      Time of occurrence:
      Location:
      Related characters:
      Event details:
      Impact results:
    ```

    Notes:
    1. All generated content must be consistent with the provided basic information
    2. Ensure that each element has a clear relationship
    3. Provide clear entity relationships for subsequent knowledge graph construction
    4. Use a unified naming convention
    5. Appropriately supplement reasonable details, but do not contradict the basic setting
    """
    return prompt


def get_character_easy_prompt_zh(character_info):
    prompt = f"""
    1. 主角信息:
    <character_info>
    {character_info}
    </character_info>

    【思考链路过程】
    我将通过以下步骤分析和丰富主角信息：

    1. 首先，我会仔细分析提供的角色基础信息，提取关键事实：
       - 角色的名字和基本身份是什么？
       - 有哪些明确提及的背景元素？
       - 已知的性格特点有哪些？
       - 角色的外貌描述中有哪些关键点？

    2. 接下来，我将思考角色的深层次特征：
       - 根据背景推测可能的成长经历
       - 分析角色行为背后的动机和价值观
       - 考虑角色的长处和弱点如何形成
       - 推断角色可能掌握的技能和知识

    3. 然后，我将考虑角色的当前处境：
       - 角色目前面临什么样的情况？
       - 这种处境对角色的心理状态有何影响？
       - 角色可能采取什么样的应对方式？

    4. 最后，我将确保角色形象的一致性和立体感：
       - 性格特点与背景经历是否相互支持？
       - 技能和能力是否与角色的历史相符？
       - 角色的情感状态是否符合当前处境？
       - 整体形象是否具有独特性和可信度？

    【正式回答】
    请按照以下严格的格式创建主角信息：

    <name>
    [2-4字角色名]
    </name>

    <description>
    [30字以内的身份和核心特征简述]
    </description>

    <personality>
    [3个性格特征，每个配一个简短例子]
    - [特征1]：[例子]
    - [特征2]：[例子]
    - [特征3]：[例子]
    </personality>

    <background>
    [50字以内，包含关键经历和现状]
    </background>

    <appearance>
    [40字以内，突出标志性外貌特征]
    </appearance>

    <skills>
    [3-4项主要技能，每项一句话]
    - [技能1]
    - [技能2]
    - [技能3]
    </skills>

    <location>
    [20字以内，当前位置和原因]
    </location>

    <status>
    [30字以内，当前情绪和目标]
    </status>
    
    注意事项：
    1. 请确保信息的完整性和准确性。
    2. 保持语言简洁，避免冗余。
    3. 信息应当与角色背景相符。
    4. 每个部分必须使用对应的XML标签包裹。
    5. 避免使用任何额外的标签或格式。
    """
    return prompt


def get_character_complex_prompt_zh(character_info):
    prompt = f"""
    根据提供的信息丰富完善主角的信息：

    1. 主角信息:
    <character_info>
    {character_info}
    </character_info>

    【思考链路过程】
    我将通过以下步骤分析和丰富主角信息：

    1. 首先，我会仔细分析提供的角色基础信息，提取关键事实：
       - 角色的名字和基本身份是什么？
       - 有哪些明确提及的背景元素？
       - 已知的性格特点有哪些？
       - 角色的外貌描述中有哪些关键点？

    2. 接下来，我将思考角色的深层次特征：
       - 根据背景推测可能的成长经历
       - 分析角色行为背后的动机和价值观
       - 考虑角色的长处和弱点如何形成
       - 推断角色可能掌握的技能和知识

    3. 然后，我将考虑角色的当前处境：
       - 角色目前面临什么样的情况？
       - 这种处境对角色的心理状态有何影响？
       - 角色可能采取什么样的应对方式？

    4. 最后，我将确保角色形象的一致性和立体感：
       - 性格特点与背景经历是否相互支持？
       - 技能和能力是否与角色的历史相符？
       - 角色的情感状态是否符合当前处境？
       - 整体形象是否具有独特性和可信度？

    【正式回答】
    请按照以下严格的格式创建主角信息：

    <name>
    [主角名称 - 确保名字符合角色的文化背景和身份]
    </name>

    <description>
    [主角的整体描述，100-200字，包含角色的核心特征、社会身份、主要经历和当前目标。这部分应当概括角色的精髓，让读者能够迅速理解这个人物是谁。]
    </description>

    <personality>
    [主角的性格，至少5个鲜明的性格特点，每个特点配以具体表现例子。包括性格优点和缺点，以及在压力下可能表现出的特殊行为模式。解释这些性格特点如何影响角色的决策和人际关系。]
    </personality>

    <background>
    [主角身份背景，300-400字，详细描述角色的成长历程、重要人生转折点、家庭关系、教育经历和职业发展。包含至少一个塑造角色世界观的关键事件，以及这些经历如何影响了角色的现在。]
    </background>

    <appearance>
    [主角外貌，200字左右，包含面部特征、体型、习惯性表情、特殊标志、穿着风格等。描述应当突出能反映角色性格或经历的外貌元素，而非简单罗列特征。]
    </appearance>

    <skills>
    [主角技能，列出8-10项具体技能，分为专业技能和日常技能两类。每项技能包含熟练程度和获得方式。技能应当与角色的背景故事相符，并解释这些技能如何在当前处境中有用或受限。]
    </skills>

    <location>
    [主角当前所在位置，包含具体地点名称、环境描述、角色与此地的关系，以及角色在此地的活动目的。解释这个位置对角色的意义和情感联系。]
    </location>

    <status>
    [主角当前心理状态，200字左右，深入分析角色面对当前处境的情绪反应、内心冲突、希望与恐惧。包含角色的短期情绪和长期心理倾向，以及可能的心理发展方向。]
    </status>

    注意事项：
    1. 请确保信息的完整性和准确性。
    2. 保持语言简洁丰富，避免冗余。
    3. 信息应当与角色背景相符。
    4. 每个部分必须使用对应的XML标签包裹。
    5. 避免使用任何额外的标签或格式。
    """
    return prompt


def get_embedded_story_prompt_zh(story_framework, character_info, history_story, recent_story, user_input):
    prompt = f"""
    你获得以下信息：

    1. 故事的整体框架或结构
    <story_framework>
    {story_framework}
    </story_framework>

    2. 主角的信息
    <character_info>
    {character_info}
    </character_info>
    
    3. 故事的历史
    <history_story>
    {history_story}
    </history_story>

    4. 故事的最新部分
    <recent_story>
    {recent_story}
    </recent_story>

    5. 当前用户输入或指令
    <user_input>
    {user_input}
    </user_input>

    【思维链路过程】
    我将通过以下步骤分析情境并构建合适的故事回应：

    1. 理解用户意图与行动分析
       - 用户输入表达了什么具体行动或决策？
       - 这个行动的直接目标是什么？
       - 行动背后可能的动机或情感是什么？
       - 这个行动与主角的性格和背景是否一致？

    2. 评估行动在故事世界中的可行性
       - 根据世界框架规则，这个行动是否可行？
       - 主角当前是否具备执行此行动的能力、资源或条件？
       - 行动可能遇到的阻碍或助力有哪些？
       - 需要进行哪些检定或判断来决定行动结果？

    3. 构思行动结果与连锁反应
       - 行动的直接成功/失败结果是什么？
       - 行动会引发哪些次级效应或连锁反应？
       - 周围环境、NPC或情境会如何响应？
       - 这些结果如何推动故事向前发展？

    4. 连接历史与当前情节
       - 当前情节与哪些历史事件相关联？
       - 可以引用哪些过去的细节来增强连贯性？
       - 主角过去的经历如何影响当前的行动结果？
       - 历史伏笔中有哪些可以在此时展开？

    5. 设计未来发展方向
       - 当前情节的发展为未来埋下了哪些伏笔？
       - 主角面临哪些新的选择或挑战？
       - 哪些新的情节线索可以引入？
       - 最自然的后续行动选择有哪些？

    【正式回答】
    请按照以下严格的格式输出回复：

    <analysis>
    [在这里分析用户输入<user_input>中的行动意图，不超过50字，包含行动类型、目标和可能的动机]
    </analysis>

    <narrative>
    [主要故事内容，需满足：
    1. 根据<analysis>的分析，直接反映主角行为的具体结果和连锁影响
    2. 引用至少1-2个相关的历史故事细节作为情节连接点
    3. 结合世界框架规则展现事件发展的合理性
    4. 生动描述场景、NPC或环境的动态变化和反应
    5. 为后续发展埋下1-2个明确的伏笔
    6. 包含适当的感官描述和情感反应
    7. 请用第三人称视角写作，300-500字]
    </narrative>

    <next_prompts>
    - [简洁的行动提示，体现直接应对当前情境的选择，不超过15字]
    - [简洁的行动提示，体现探索新可能性的选择，不超过15字]
    - [简洁的行动提示，体现情感或社交互动的选择，不超过15字]
    </next_prompts>

    注意事项：
    1. 严格使用第三人称视角，避免使用"你"或直接对读者说话
    2. 每个部分必须使用对应的XML标签包裹
    3. 确保叙述与故事框架保持一致，不要引入与世界设定冲突的元素
    4. 行动提示应该多样化，覆盖不同类型的可能行动
    5. 避免使用任何额外的标签或格式
    6. 不要过度解释或总结，让故事情节自然流动
    """
    return prompt


def get_setting_prompt_zh(story_framework, character_info):
    prompt = f"""

    1. 故事的整体框架或结构
    <story_framework>
    {story_framework}
    </story_framework>
    
    2. 主角的信息
    <character_info>
    {character_info}
    </character_info>
            
    请按照以下严格的格式创建开场场景：

    <narrative>
    [根据故事框架和主角信息，创建一个开场场景，300-500字]
    </narrative>

    <next_prompts>
    - [简洁的行动提示，不超过15字]
    - [简洁的行动提示，不超过15字]
    - [简洁的行动提示，不超过15字]
    </next_prompts>

    注意事项：
    1. 严格使用第三人称视角
    2. 每个部分必须使用对应的XML标签包裹
    3. 场景描述要与故事框架和角色设定保持一致
    4. 行动机会应该自然地融入当前场景
    5. 避免使用任何额外的标签或格式
    """
    return prompt


def get_text_adventure_prompt_zh():
    prompt = """
    你是一个高级AI文字游戏系统，负责创建基于玩家行动的沉浸式文字冒险游戏体验， 故事内容以第三人称视角写作。
    
    遵循以下指导原则：
    
    0. 优先处理玩家行动 - 始终从处理上一轮的 <user_input> 开始
    
    1. 始终保持与既定世界框架的一致性：
       - 地理位置及其关系
       - 角色及其性格
       - 世界规则（包括任何魔法/科技系统）
       - 已经确立的历史事件

    2. 结合历史故事和近期故事，为玩家提供连续的叙事体验：
       - 引用相关的历史故事细节作为情节连接
       - 结合世界框架规则展现事件发展
       - 体现场景、NPC或环境的动态变化
       - 为后续发展埋下伏笔

    3. 对玩家的行动做出直接回应，并给出适当的后果：
       - 描述他们行动的结果
       - 包含感官细节（他们看到、听到、感觉到的等）
       - 引入适当的挑战和机会
       - 允许玩家代理权和有意义的选择
    
    3. 通过以下方式自然推进叙事：
       - 引入符合既定世界的新元素
       - 创造有趣的情况和冲突
       - 提供探索和发现的机会
       - 保持适当的节奏
    
    4. 平衡细节和简洁：
       - 对新位置和重要元素提供丰富的描述
       - 保持常规互动简洁
       - 关注对玩家最有趣的内容
    """
    return prompt


def get_story_compressor_prompt_zh(user_input, story):
    prompt = f"""
    你是一个故事压缩器。你的任务是根据用户的输入压缩故事，同时遵循以下具体规则：

    1.用户的阶段性输入
    <user_input>
    {user_input}
    </user_input>

    2. 故事的阶段性发展
    <story>
    {story}
    </story>

    【思维链路过程】
    我将通过以下步骤系统地压缩故事：

    1. 识别核心情节元素
       - 首先，我会仔细阅读故事，找出主要的情节点
       - 确定故事中的转折点和关键决策时刻
       - 识别推动故事发展的主要行动和事件
       - 找出与用户输入直接相关的情节部分
       - 标记故事的起因、发展和结果

    2. 评估元素重要性
       - 对每个情节元素进行评估，判断其对整体故事的必要性
       - 区分核心事件与装饰性描述
       - 确定哪些角色互动是推动情节必需的
       - 评估哪些环境描述可以省略而不影响理解
       - 识别可合并的相似或相关事件

    3. 构建因果链
       - 确保保留的事件之间有明确的因果关系
       - 验证事件顺序的逻辑性
       - 确认每个保留的事件如何导致下一个事件
       - 检查是否有任何逻辑跳跃或断层
       - 确保压缩后的故事仍然具有完整的因果链

    4. 执行压缩
       - 将选定的核心事件转化为简洁的陈述句
       - 移除所有修饰性语言和非必要描述
       - 使用直接、简明的语言表达每个事件
       - 确保每个事件陈述都包含关键信息
       - 用箭头符号连接事件，形成清晰的事件链

    【正式回答】
    请按照以下严格的格式返回压缩后的故事：

    <event>
    [核心事件1，简洁陈述] ——> [核心事件2，简洁陈述] ——> [核心事件3，简洁陈述] ——> [最终结果，简洁陈述]
    </event>
    
    压缩指南：
    1. 保留必要元素：
       - 主要情节点和关键转折
       - 主角的核心行动和决策
       - 重要的场景转换
       - 关键的人物互动
       - 直接的因果关系

    2. 删除以下元素：
       - 所有修饰性描述和形容词
       - 非关键对话和内心独白
       - 重复信息和冗余内容
       - 不影响情节的环境细节
       - 次要角色的非必要行动

    3. 格式要求：
       - 使用第三人称视角
       - 每个事件陈述控制在5-10个字
       - 事件之间使用 "——>" 符号连接
       - 不使用任何数字编号或序号
       - 整个压缩故事应包含4-8个关键事件点
    """
    return prompt


def get_world_prompt_zh():
    prompt = """
    你是一个专业的世界框架生成器，需要创建一个内容丰富、逻辑连贯且关系明确的游戏世界知识库，形式类似于维基百科。作为一个世界构建专家，你需要：

    1. 内容创作职责：
       - 基于用户提供的初始故事背景，扩展并丰富世界观
       - 创造符合逻辑的历史脉络和文化体系
       - 设计具有独特性格和明确动机的NPC角色
       - 构建合理的地理环境和政治格局

    2. 知识关联原则：
       - 确保所有生成内容之间存在明确的逻辑关联
       - 建立清晰的地理位置引用体系
       - 构建完整的人物关系网络
       - 创建连贯的历史事件链条

    3. 知识图谱适配：
       - 使用统一的命名规范和术语体系
       - 明确标注实体之间的关系类型
       - 提供清晰的属性描述和关联信息
       - 保持信息的结构化和规范化

    4. 创作原则：
       - 保持设定的一致性和连贯性
       - 创造合理的冲突和矛盾
       - 平衡不同势力和文化的影响
       - 留下适当的探索空间和悬念

    5. 质量标准：
       - 确保内容的完整性和深度
       - 维持叙述的客观性和中立性
       - 避免逻辑漏洞和设定冲突
       - 提供足够的细节支撑

    你的核心目标是构建一个既能支持故事发展，又便于知识图谱构建的完整世界框架。所有输出内容都应当符合知识图谱框架的处理需求，确保信息的可追溯性和关联性。
    """
    return prompt


def get_structured_prompt_zh(story_framework, character_info):
    prompt = f"""
    基于以下提供的基础信息，请创建完整的世界框架：

    故事基础框架：
    <story_framework>
    {story_framework}
    </story_framework>

    主要角色信息：
    <character_info>
    {character_info}
    </character_info>
    
    【重要格式说明】
    你的回答必须严格按照以下XML标签格式输出，所有内容都必须包含在对应的标签内：
    1. 世界结构部分必须被<world_structure>标签包裹
    2. 重要NPC部分必须被<important_npc>标签包裹
    3. 历史事件部分必须被<history>标签包裹
    4. 世界架构部分必须被<world_architecture>标签包裹
    5. 不允许在标签外输出任何正文内容
    6. 标签必须正确配对(开始标签和结束标签)

    【思维链路过程】
    首先，我将分析主角的背景、身份和经历，这将成为构建整个世界的起点：
    1. 主角来自哪里？这个地方在世界中的位置和重要性如何？
    2. 主角的身份和背景暗示了哪些社会结构和势力分布？
    3. 主角的经历涉及到哪些地点、人物和历史事件？

    接下来，我将从主角的视角向外扩展，逐步构建世界的各个层级：
    1. 主角所在的直接环境（城镇、组织等）
    2. 影响主角的中层势力（王国、派系等）
    3. 整个世界的宏观格局（大陆、文明等）

    然后，我将确定世界中的关键NPC，优先考虑：
    1. 与主角有直接关联的人物
    2. 掌握重要势力的领导者
    3. 历史事件中的关键参与者
    4. 能够推动故事发展的特殊角色

    最后，我将构建历史事件，特别关注：
    1. 塑造当前世界格局的转折点
    2. 影响主角命运的关键事件
    3. 各大势力之间冲突的起源
    4. 埋藏在世界中的秘密和谜团

    【输出格式要求】
    你的回答必须严格按照以下格式，并确保所有内容都在对应的XML标签内：

    <world_structure>
    (至少3个世界级实体，每个至少100字描述，包含名称、基本设定、主要特征、地理位置、历史背景)

    (至少5个王国/国家/地区，每个至少100字描述，包含统治者、社会结构、与世界层级的关联、特色文化)

    (至少7个城镇/村庄/据点，每个至少80字描述，包含位置、特色、重要建筑、与王国的关系)
    </world_structure>

    <important_npc>
    (至少12个NPC，每个至少包含以下要素)
    1. [姓名] - [身份/职业]
    - 外貌: [详细描述]
    - 所在位置: [关联到具体城镇或王国]
    - 背景故事: [个人历史，至少80字]
    - 性格特点: [3-5个性格特点及行为模式]
    - 目标与动机: [当前追求的目标及深层动机]
    - 人际关系: [与至少2-3个其他NPC的关系]
    - 历史角色: [在某个历史事件中的参与]
    - 掌握资源: [重要信息、物品或能力]
    </important_npc>

    <history>
    (至少6个历史事件，每个至少120字，按时间顺序排列)
    1. [事件名称] - [发生时间]
    - 地点: [关联到具体地区]
    - 参与者: [关联到具体NPC]
    - 起因: [事件的导火索和背景]
    - 经过: [事件的主要过程]
    - 结果: [事件的直接后果]
    - 影响: [对世界格局的长远影响]
    - 不同解读: [不同势力对此事件的看法]
    - 遗留问题: [事件留下的谜团或冲突]
    </history>

    <world_architecture>
    (至少300字的世界架构综合描述)
    - 世界的核心主题和冲突
    - 主要势力之间的平衡与对抗
    - 世界的魔法/科技/宗教系统
    - 主角在这个世界中的定位和可能的命运轨迹
    - 世界面临的主要威胁或挑战
    - 潜在的故事发展方向
    </world_architecture>

    【最终格式检查】
    在完成回答后，请确认：
    1. 所有内容都被正确的XML标签包裹
    2. 没有任何正文内容出现在标签之外
    3. 所有标签都正确配对
    4. 内容符合每个部分的最小字数要求
    5. 各部分之间保持逻辑连贯性和交叉引用

    注意事项：
    - 每个部分必须使用对应的XML标签包裹
    - 所有内容必须以主角背景为核心出发点，逐步扩展
    - 确保三个部分之间建立明确的关联，包括地点、人物、事件的交叉引用
    - 所有生成内容必须与提供的基础信息保持一致性
    - 为每个实体创建独特而合理的特征，避免刻板印象
    - 设计适当的冲突和张力，为故事发展提供动力
    - 留下一些有意的空白和谜团，为未来故事发展预留空间
    """
    return prompt
