import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Container, Form, SubmitButton, List } from './styles';
import api from '../../services/api';

export default function Main() {
  const [repository, setRepository] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const repositoriesSaved = localStorage.getItem('repositories');

    if (repositoriesSaved) {
      setRepositories(JSON.parse(repositoriesSaved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const response = await api.get(`/repos/${repository}`);

    const { full_name: name } = response.data;

    setRepositories([...repositories, { name }]);
    setRepository('');
    setLoading(false);
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adicionar repositório"
          value={repository}
          onChange={e => setRepository(e.target.value)}
        />

        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>
      <List>
        {repositories.map(repository => (
          <li key={repository.name}>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
