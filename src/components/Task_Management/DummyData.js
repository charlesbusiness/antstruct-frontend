const dummyTasks = {
    pending: [
      {
        id: 1,
        title: "Design new homepage layout",
        assignee: "Sarah Johnson",
        dueDate: "2023-06-15",
        priority: "High",
        progress: 0
      },
      {
        id: 2,
        title: "Research competitors",
        assignee: "Michael Chen",
        dueDate: "2023-06-10",
        priority: "Normal",
        progress: 20
      }
    ],
    inProgress: [
      {
        id: 3,
        title: "Implement authentication API",
        assignee: "Alex Rodriguez",
        dueDate: "2023-06-20",
        priority: "High",
        progress: 65
      },
      {
        id: 4,
        title: "Database optimization",
        assignee: "Jamie Smith",
        dueDate: "2023-06-18",
        priority: "Moderate",
        progress: 40
      }
    ],
    done: [
      {
        id: 5,
        title: "Setup CI/CD pipeline",
        assignee: "Taylor Wilson",
        dueDate: "2023-05-30",
        priority: "Normal",
        progress: 100
      },
      {
        id: 6,
        title: "User onboarding flow",
        assignee: "Jordan Lee",
        dueDate: "2023-06-05",
        priority: "High",
        progress: 100
      }
    ]
  };

  export default dummyTasks;