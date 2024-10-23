import { useState, useEffect } from 'react';

interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  members: {
    id: string;
    name: string;
    voting_power: number;
  }[];
}

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/projects.json'); 
      const data = await response.json();
      setProjects(data.projects);
    };

    fetchProjects();
  }, []);

  return projects;
};

export default useProjects;
