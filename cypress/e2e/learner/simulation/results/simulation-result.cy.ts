export {}

type Role = Parameters<typeof cy.login>[0]
const BACKEND_URL = Cypress.env('apiBaseUrl')

const mockSimulationResults = {
  simulation: {
    created_at: '2024-12-09T08:00:00Z',
    updated_at: '2024-12-09T09:00:00Z',
    deleted_at: null,
    _id: 'sim123',
    case_id: 'case456',
    learner_id: 'learner789',
    start_at: '2024-12-09T08:15:00Z',
    end_at: '2024-12-09T08:45:00Z',
    resume_at: ['2024-12-09T08:20:00Z', '2024-12-09T08:30:00Z'],
    pause_at: ['2024-12-09T08:25:00Z'],
    simulation_result: {
      sections_score: [
        { section_id: 'sec1', score: 80 },
        { section_id: 'sec2', score: 90 },
        { section_id: 'sec3', score: 85 },
        { section_id: 'sec4', score: 90 },
        { section_id: 'sec5', score: 75 },
        { section_id: 'sec6', score: 88 },
        { section_id: 'sec7', score: 92 }
      ],
      overall_score: 85,
      overall_correct: 17,
      overall_total: 20
    },
    form_answers: [
      {
        question_no: '1',
        answer: 'Yes',
        section: 'A. Communication',
        is_additional: false
      },
      {
        question_no: '2',
        answer: 'No',
        section: 'B. Problem-Solving',
        is_additional: false
      },
      {
        section: 'C. Leadership',
        question_no: '3',
        answer:
          'I would lead the team by setting clear goals and fostering collaboration among members.',
        is_additional: false
      },
      {
        section: 'D. Time Management',
        question_no: '4',
        answer:
          'I prioritize tasks based on urgency and importance, ensuring deadlines are met.',
        is_additional: false
      },
      {
        section: 'E. Teamwork',
        question_no: '5',
        answer:
          'I believe in leveraging each team member’s strengths to achieve our common goals.',
        is_additional: true
      },
      {
        section: 'F. Problem-Solving',
        question_no: '6',
        answer:
          'I approach problems by analyzing the situation and brainstorming potential solutions with the team.',
        is_additional: false
      }
    ],
    message: 'Simulation completed successfully'
  },
  serviceData: {
    _id: 'case456',
    simulation_type: {
      created_at: '2024-12-08T10:00:00Z',
      updated_at: '2024-12-09T10:00:00Z',
      deleted_at: null,
      _id: 'sim123',
      case_id: 'case456',
      learner_id: 'learner789',
      start_at: '2024-12-09T08:15:00Z',
      end_at: '2024-12-09T08:45:00Z',
      resume_at: ['2024-12-09T08:20:00Z', '2024-12-09T08:30:00Z'],
      pause_at: ['2024-12-09T08:25:00Z'],
      simulation_result: {
        sections_score: [
          { section_id: 'sec1', score: 80 },
          { section_id: 'sec2', score: 90 },
          { section_id: 'sec3', score: 85 },
          { section_id: 'sec4', score: 90 },
          { section_id: 'sec5', score: 75 },
          { section_id: 'sec6', score: 88 },
          { section_id: 'sec7', score: 92 }
        ],
        overall_score: 85,
        overall_correct: 17,
        overall_total: 20
      },
      form_answers: [
        {
          section: 'A. Communication',
          question_no: '1',
          answer: 'Option A',
          is_additional: false
        },
        {
          section: 'B. Problem-Solving',
          question_no: '2',
          answer:
            'I would mediate the conflict by encouraging open communication between the team members.',
          is_additional: false
        },
        {
          section: 'C. Leadership',
          question_no: '3',
          answer: 'The simulation provided valuable insights.',
          is_additional: true
        },
        {
          section: 'D. Leadership Skills',
          question_no: '4',
          answer:
            'I prioritize tasks based on urgency and importance, ensuring deadlines are met.',
          is_additional: false
        }
      ],
      message: 'Simulation completed successfully'
    },
    character: {
      avatar:
        'https://s3-alpha-sig.figma.com/img/f665/e9e1/aa2e309d613bf90779fc9744b7d69868?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lPKhiqbK-1GsFwkwL9J4cEiLTCYzpRInvNqwRR4m2hQIUDHku2yPceRdOT4lVgB9Cs0UfmhCMoQWavjslPJWqf9L9~xdBczU2QyXWcJXJi275AmnpXTN1ZGKoaMiXor4BwclYAttTzTt0JlpDrKPO8zWeQBixSJu2l26EICfxTQeZTjckb9agf5bP3bPCkhIITCxFf-gDm-Je1hZrIzb8~HvqxNB0zq49DB8fR~MU2IB0wlt--ScKy69gX8D9TmGwmaT~7TXa25Bqx4nougzYiQk5ayMHCN6fWlmkXGTx69gmqDq8RH8oabZMeCnatDWmLt1ks~rdSp1InKAFVgBPA__', // Example avatar path
      name: 'John Doe', // Character name
      gender: 'Male', // Character gender
      audio: '/path/to/audio.mp3', // Example audio path
      languages: ['English', 'Spanish'], // Character languages
      birthday: '1990-01-01', // Character birthday
      details: `<p><strong>Tan Kim Boon</strong> is a single 62 year old man who lives alone in a 3-room HDB flat at Clementi, which he bought 27 years ago. Cras dui et lectus mauris. Pellentesque at vulputate lorem aenean. Sem proin nisl cras adipiscing cursus. Ut non in maecenas ac nisi diam. Mauris id sem eget nisi enim congue.</p>
        <br />
        <h2>Family</h2>
        <p>Dolor et netus cras sed non morbi ac id. Sit tortor blandit purus viverra auctor aliquam est pellentesque risus. Laoreet et mattis rutrum interdum at elementum aliquam vitae viverra.</p>
        <br />
        <h2>Education</h2>
        <p>Morbi nisi turpis ultrices non adipiscing faucibus in. Pretium enim gravida non tortor. Sapien magna mus amet adipiscing ultricies purus et. Fames netus amet tempor consectetur.</p>` // Character details in HTML
    },
    character_data: {
      name: 'John Doe', // Character name
      birthday: '1990-01-01', // Character birthday
      languages: ['English', 'Spanish'] // Character languages
    },
    environment: {
      image:
        'https://s3-alpha-sig.figma.com/img/0749/74f5/14fd96d23d9795247650ea57fba3da66?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=f7r7MMJLCqTuynvD6qefrGJbnN4Up2muPUsaLbS2OYmB-Bk1NWo84Iuv7c4MTeygZIvetUXBUjvfxGC~fKhfEidR-QQ5iOf~jGHF-odFaFTSx0iWt~-gkbe5jd2L5l8z1GIBBU~0SKI65aXe6w71yuPd20Bg7823cRRxemb3kUruB7hZKQPL1AeA1XXO6UNN-fJPm3f8xYvaySj7~xDRKO7AJE6mUZC6dA-UvBiMYjrqDkz9l87YanMxdFoWXPrZQwg0dthivHlSwEhY7X5JyBNRvboWt4ldAJ5H9zO4zIaeJchPp0sNErjGLuhWHlchX9R01nKlvWDrFsK7jzExrg__', // Example environment image path
      location: 'Clementi, Singapore', // Environment location
      description:
        '<p>Nunc consequat velit mauris sit tellus hac et orci feugiat. Sit amet pretium justo aliquam donec. Diam tellus tincidunt tempus egestas velit fringilla at consectetur.</p>' // Environment description in HTML
    },
    title: 'Sed elit platea at pulvinar nisi ultricies amet',
    description:
      'Quisque tincidunt dolor id proin aliquet sodales feugiat velit. Placerat tincidunt dignissim cursus purus neque. In cursus morbi cras egestas odio. Gravida varius enim sapien justo ut odio eget fermentum in. Feugiat fringilla convallis leo in nullam quam pretium.',
    is_published: true,
    last_attempt: '2024-12-08T10:00:00Z',
    deleted_at: null,
    form_questions: [
      {
        _id: 'fq1',
        case_id: 'case456',
        section: 'A. Communication',
        question_no: '1',
        question_type: 'Multiple Choice',
        section_description: 'Introduction to the scenario',
        main_title: 'Understanding the scenario',
        main_description:
          'Assess the given scenario and select the best action.',
        sub_title: 'Background',
        sub_title_description: 'Review the background information provided.',
        key_question: 'What would you do next?',
        options: [
          {
            _id: 'opt1',
            option: 'Option A',
            option_description: 'Explain why you would do this.'
          },
          {
            _id: 'opt2',
            option: 'Option B',
            option_description: 'Another possible choice.'
          }
        ],
        correct_answer: 'Option A',
        pre_fill: '',
        dependency: '',
        table_row_title: '',
        add_next_row_if_last_row: '',
        deleted_at: null
      },
      {
        _id: 'fq2',
        case_id: 'case456',
        section: 'B. Problem-Solving',
        question_no: '2',
        question_type: 'Open Ended',
        section_description: 'Handling team conflicts',
        main_title: 'Resolving issues',
        main_description: 'Describe your approach to resolving the conflict.',
        sub_title: 'Details',
        sub_title_description: 'Explain your thought process.',
        key_question: 'How would you mediate the conflict?',
        options: [
          {
            _id: 'opt1',
            option: 'Option A',
            option_description: 'Explain why you would do this.'
          },
          {
            _id: 'opt2',
            option: 'Option B',
            option_description: 'Another possible choice.'
          }
        ],
        correct_answer: '',
        pre_fill: '',
        dependency: '',
        table_row_title: '',
        add_next_row_if_last_row: '',
        deleted_at: null
      },
      {
        _id: 'fq4',
        case_id: 'case456',
        section: 'C. Leadership',
        question_no: '3',
        question_type: 'Open Ended',
        section_description: 'Assessing leadership skills in practice',
        main_title: 'Leadership Assessment',
        main_description:
          'Describe a situation where you demonstrated leadership.',
        sub_title: 'Your Experience',
        sub_title_description:
          'Share your insights on your leadership experience.',
        key_question: 'What leadership qualities did you exhibit?',
        options: [
          {
            _id: 'opt1',
            option: 'Option A',
            option_description: 'Explain why you would do this.'
          },
          {
            _id: 'opt2',
            option: 'Option B',
            option_description: 'Another possible choice.'
          }
        ],
        correct_answer: '',
        pre_fill: '',
        dependency: '',
        table_row_title: '',
        add_next_row_if_last_row: '',
        deleted_at: null
      }
    ],
    created_at: '2024-12-08T08:00:00Z',
    creator: {
      name: 'Instructor One',
      email: 'instructor@example.com'
    },
    start_at: '2024-12-09T08:15:00Z',
    difficulty: 'Medium',
    current_step: 3,
    is_published_once: true
  },
  learner: {
    _id: 'learner789',
    fullname: 'John Doe',
    email: 'johndoe@example.com',
    user_type: 'Learner'
  },
  allAttempts: [
    {
      _id: 'sim123',
      start_at: '2024-12-09T08:15:00Z',
      end_at: '2024-12-09T08:45:00Z'
    },
    {
      _id: 'sim124',
      start_at: '2024-12-08T07:00:00Z',
      end_at: '2024-12-08T07:30:00Z'
    }
  ],
  previousAttempt: {
    _id: 'sim124',
    start_at: '2024-12-08T07:00:00Z',
    end_at: '2024-12-08T07:30:00Z'
  },
  nextAttempt: null,
  displayScores: {
    sections: [
      {
        name: 'A. Communication',
        score: 80,
        showAnswers: true,
        showScore: true,
        total: 100
      },
      {
        name: 'B. Problem-Solving',
        score: 90,
        showAnswers: false,
        showScore: false,
        total: 0
      },
      {
        name: 'C. Leadership',
        score: 85,
        showAnswers: true,
        showScore: true,
        total: 100
      },
      {
        name: 'D. Time Management',
        score: 75,
        showAnswers: true,
        showScore: true,
        total: 100
      }
    ],
    overall: { score: 85, total: 100 },
    totalScore: 85
  },
  isCompetent: true,
  percentile: 95,
  softSkills: {
    summary:
      'You exhibited a high level of empathy during the session but more can be done to work on clarity.',
    ratings: [
      {
        skill: 'Leadership',
        score: 80,
        total: 100,
        description:
          'Demonstrates a solid understanding of leadership principles and effectively guides team members towards achieving common goals. Shows the ability to inspire and motivate others, fostering a positive team environment.',
        importance:
          'High - This skill is crucial for ensuring that team members are aligned with the organization’s vision and are motivated to perform at their best, ultimately driving success.',
        assessment: [
          'Assessment 1: Evaluates the ability to lead a team through challenges and achieve objectives.',
          'Assessment 2: Measures the effectiveness of communication and influence in leadership scenarios.'
        ]
      },
      {
        skill: 'Communication',
        score: 90,
        total: 100,
        description:
          'Exhibits exceptional communication skills, both verbal and written. Effectively conveys ideas and information, ensuring clarity and understanding among team members and stakeholders. Actively listens and engages in constructive dialogue.',
        importance:
          'High - Effective communication is essential for collaboration and understanding within teams, as well as for building relationships with stakeholders.',
        assessment: [
          'Assessment 1: Assesses clarity and effectiveness in conveying messages in various formats.',
          'Assessment 2: Evaluates active listening skills and the ability to engage in meaningful discussions.'
        ]
      },
      {
        skill: 'Problem-Solving',
        score: 75,
        total: 100,
        description:
          'Displays a good ability to analyze problems and develop effective solutions. Approaches challenges with a logical mindset and collaborates with others to find innovative ways to overcome obstacles.',
        importance:
          'Medium - This skill is important for navigating challenges and finding effective solutions, contributing to overall team success.',
        assessment: [
          'Assessment 1: Evaluates the ability to identify problems and propose viable solutions.',
          'Assessment 2: Measures collaboration with team members in problem-solving scenarios.'
        ]
      },
      {
        skill: 'Feedback',
        score: 85,
        total: 100,
        description:
          'Provides constructive feedback that is both insightful and actionable. Recognizes the importance of feedback in personal and team development, and encourages an open dialogue for continuous improvement.',
        importance:
          'Low - While feedback is valuable, it is one of many components that contribute to overall performance and development.',
        assessment: [
          'Assessment 1: Assesses the ability to give and receive feedback effectively.',
          'Assessment 2: Evaluates the impact of feedback on team dynamics and individual growth.'
        ]
      },
      {
        skill: 'Teamwork',
        score: 80,
        total: 100,
        description:
          'Collaborates effectively with team members, contributing to a cohesive and productive work environment. Values diverse perspectives and works towards building strong relationships within the team.',
        importance:
          'High - Teamwork is vital for achieving collective goals and fostering a supportive work culture.',
        assessment: [
          'Assessment 1: Evaluates collaboration skills and the ability to work well with others.',
          'Assessment 2: Measures contributions to team projects and overall team success.'
        ]
      }
    ]
  },
  transcripts: [
    {
      _id: 'trans123',
      from: 'Alex',
      from_type: 'user',
      simulation: 'sim123',
      dialogue_value:
        'Can you handle this project? I know it’s a big task, but I believe you have the skills to manage it effectively. What do you think?',
      comments: [
        {
          text: 'Good response! Your ability to articulate your thoughts clearly is commendable, and it shows that you are ready to take on challenges. Keep up the great work!',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans124',
      from: 'Jordan',
      from_type: 'character',
      simulation: 'sim123',
      dialogue_value:
        'I believe we can achieve our goals together. With our combined efforts and clear communication, I’m confident we can tackle any challenges that come our way. Let’s make a plan!',
      comments: [
        {
          text: 'Excellent teamwork! It’s inspiring to see how you emphasize collaboration and the importance of working together. This mindset will undoubtedly lead to our success.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans125',
      from: 'Taylor',
      from_type: 'user',
      simulation: 'sim123',
      dialogue_value:
        'What are the next steps for this project? I want to ensure we’re all on the same page and moving forward efficiently. Should we outline our tasks and deadlines?',
      comments: [
        {
          text: 'Great question! Your proactive approach to seeking clarity is essential for effective project management. It shows your commitment to ensuring everyone is aligned.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans126',
      from: 'Morgan',
      from_type: 'character',
      simulation: 'sim123',
      dialogue_value:
        'I need more information to proceed. If we could gather all the necessary data and insights, it would help me understand the scope better. Can we set up a meeting to discuss this in detail?',
      comments: [
        {
          text: 'Very insightful! Your request for more information demonstrates a thorough understanding of the project’s complexities. It’s crucial to have all the details before moving forward.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans127',
      from: 'Casey',
      from_type: 'user',
      simulation: 'sim123',
      dialogue_value:
        'Let’s brainstorm some ideas. I think it would be beneficial for us to throw around some concepts and see what resonates. Collaboration is key, and I’m excited to hear everyone’s thoughts!',
      comments: [
        {
          text: 'Love the initiative! Your enthusiasm for collaboration and idea generation is infectious. It’s this kind of proactive engagement that fosters creativity and innovation within the team.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans128',
      from: 'Alex',
      from_type: 'user',
      simulation: 'sim123',
      dialogue_value:
        'I think we should prioritize our tasks based on urgency. What does everyone think about creating a timeline?',
      comments: [
        {
          text: 'Great suggestion! Prioritizing tasks is essential for effective time management. Let’s outline our timeline together.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans129',
      from: 'Jordan',
      from_type: 'character',
      simulation: 'sim123',
      dialogue_value:
        'I agree, having a clear timeline will help us stay on track. Should we assign specific roles for each task?',
      comments: [
        {
          text: 'Excellent point! Assigning roles can enhance accountability and ensure that everyone knows their responsibilities.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans130',
      from: 'Taylor',
      from_type: 'user',
      simulation: 'sim123',
      dialogue_value:
        'Yes, let’s make sure we communicate regularly to update each other on our progress. How often should we check in?',
      comments: [
        {
          text: 'Very proactive! Regular communication is key to successful collaboration. Weekly check-ins could be beneficial.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans131',
      from: 'Morgan',
      from_type: 'character',
      simulation: 'sim123',
      dialogue_value:
        'I think bi-weekly meetings would be ideal. This way, we can discuss any challenges and adjust our plans as needed.',
      comments: [
        {
          text: 'Great idea! Flexibility in our approach will help us adapt to any unforeseen issues.',
          author: 'Instructor'
        }
      ]
    },
    {
      _id: 'trans132',
      from: 'Casey',
      from_type: 'user',
      simulation: 'sim123',
      dialogue_value:
        'Let’s also consider using a project management tool to keep everything organized. Any recommendations?',
      comments: [
        {
          text: 'Fantastic thought! Using a project management tool can streamline our workflow and enhance collaboration.',
          author: 'Instructor'
        }
      ]
    }
  ],
  survey: {
    questions: [
      {
        id: 'q1',
        text: 'How challenging was the simulation?',
        response: 'Very challenging'
      }
    ]
  }
}

function interceptSimulationResults(simulationId: string, orgSlug: string) {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/api/${orgSlug}/learner/simulation/${simulationId}/results`,
    (req) => {
      req.reply({
        statusCode: 200,
        body: mockSimulationResults
      })
    }
  ).as('simulationResults')
}

function authenticateUser(role: Role) {
  cy.intercept('GET', `${BACKEND_URL}/api/auth/me`, {
    fixture: `auth/me/success/${role}.json`
  })
}

function interceptAudioFile() {
  cy.intercept('GET', `${BACKEND_URL}/path/to/audio.mp3`, {
    statusCode: 200,
    body: 'Audio file content or mock data here' // You can replace this with actual mock data if needed
  }).as('audioFile')
}

function testSimulationResultsOnServiceDetailsTab() {
  it('Should display simulation results on the service details tab', () => {
    const role: Role = 'learner'
    cy.login(role)

    cy.visit('/public/learner/simulation/1/results')

    authenticateUser(role)
    authenticateUser(role)

    interceptSimulationResults('1', 'public')
    interceptAudioFile()
    cy.get('h1')
      .contains(mockSimulationResults.serviceData.title)
      .should('be.visible')

    cy.get('button[data-state="active"]').contains('Details').should('exist')

    cy.get('h3').contains('Overall Score').should('exist')
    cy.get('p')
      .contains(mockSimulationResults.displayScores.overall.score)
      .should('exist')

    cy.get('p')
      .contains(mockSimulationResults.serviceData.description)
      .should('exist')

    cy.get('p')
      .contains(mockSimulationResults.serviceData.character_data.name)
      .should('exist')

    cy.get('p')
      .contains(
        new Date(
          mockSimulationResults.serviceData.character_data.birthday
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })
      )
      .should('exist')

    cy.get('p')
      .contains(mockSimulationResults.serviceData.character.gender)
      .should('exist')

    cy.get('p')
      .contains(
        mockSimulationResults.serviceData.character.languages.join(', ')
      )
      .should('exist')

    cy.get('p')
      .contains(mockSimulationResults.serviceData.environment.location)
      .should('exist')

    cy.get('p')
      .contains(mockSimulationResults.softSkills.summary)
      .should('exist')
  })
}

function testSimulationResultsOnScoreSummaryTab() {
  it('Should display simulation results on the score summary tab', () => {
    const role: Role = 'learner'
    cy.login(role)

    cy.visit('/public/learner/simulation/1/results')

    authenticateUser(role)
    authenticateUser(role)

    interceptSimulationResults('1', 'public')
    interceptAudioFile()
    cy.get('h1')
      .contains(mockSimulationResults.serviceData.title)
      .should('be.visible')

    cy.get('button').contains('Score Summary').click()

    for (const section of mockSimulationResults.displayScores.sections) {
      const splitSectionName = section.name.split('. ')
      const sectionName = splitSectionName[1]
      const sectionLetter = splitSectionName[0].split('.')[0]
      cy.get('p').contains(sectionLetter).should('exist')
      cy.get('p').contains(sectionName).should('exist')
      if (section.showScore) {
        cy.get('span').contains(`${section.score}%`).should('exist')
      } else {
        cy.get('span').contains('N/A').should('exist')
      }
    }

    const sectionQuestions =
      mockSimulationResults.serviceData.form_questions[0].options
    for (const option of sectionQuestions) {
      cy.get('p').contains(option.option_description).should('exist')
    }

    const sectionQuestions2 =
      mockSimulationResults.serviceData.form_questions[1]
    const splitSectionName = sectionQuestions2.section.split('. ')
    const sectionName = splitSectionName[1]

    cy.get('button').contains(sectionName).click()

    for (const option of sectionQuestions2.options) {
      cy.get('p').contains(option.option_description).should('exist')
    }
  })
}

function testSimulationResultsOnTranscriptTab() {
  it('Should display simulation results on the transcript tab', () => {
    const role: Role = 'learner'
    cy.login(role)

    cy.visit('/public/learner/simulation/1/results')

    authenticateUser(role)
    authenticateUser(role)

    interceptSimulationResults('1', 'public')
    interceptAudioFile()
    cy.get('h1')
      .contains(mockSimulationResults.serviceData.title)
      .should('be.visible')

    cy.get('button').contains('Transcript').click()

    for (const transcript of mockSimulationResults.transcripts) {
      cy.get('p').contains(transcript.dialogue_value).should('exist')
    }
  })
}

function testSimulationResultsOnSoftSkillsTab() {
  it('Should display simulation results on the soft skills tab', () => {
    const role: Role = 'learner'
    cy.login(role)

    cy.visit('/public/learner/simulation/1/results')

    authenticateUser(role)
    authenticateUser(role)

    interceptSimulationResults('1', 'public')
    interceptAudioFile()
    cy.get('h1')
      .contains(mockSimulationResults.serviceData.title)
      .should('be.visible')

    cy.get('button').contains('Soft Skills').click()

    for (const rating of mockSimulationResults.softSkills.ratings) {
      cy.get('h4').contains(rating.skill).should('exist')
      cy.get('span').contains(rating.score).should('exist')
      cy.get('button').contains(rating.skill).click()
      cy.get('p').contains(rating.description).should('exist')
      cy.get('p').contains(rating.importance).should('exist')
      for (const assessment of rating.assessment) {
        cy.get('p').contains(assessment).should('exist')
      }
    }
  })
}

describe('Simulation Results on Admin (Desktop)', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080) // 16:9 1080p display
  })

  testSimulationResultsOnServiceDetailsTab()
  testSimulationResultsOnScoreSummaryTab()
  testSimulationResultsOnTranscriptTab()
  testSimulationResultsOnSoftSkillsTab()
})

describe('Simulation Results on Admin (Mobile)', () => {
  beforeEach(() => {
    cy.viewport('iphone-se2')
  })
  testSimulationResultsOnServiceDetailsTab()
  testSimulationResultsOnScoreSummaryTab()
  testSimulationResultsOnTranscriptTab()
  testSimulationResultsOnSoftSkillsTab()
})
