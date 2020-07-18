import React, { useState, FormEvent, useEffect }from 'react';
import { FiChevronRight } from 'react-icons/fi'; // feather icons
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/logo_dog.png';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };


}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem(
            '@GithuExplorer:repositores',
        );

        if (storagedRepositories) {
            return JSON.parse(storagedRepositories);
        }
        return [];

     });

    // useEffect (() => {
    //     const repositorios = localStorage.getItem('@GithuExplorer:repositores');
    //     if (repositorios) {
    //         setRepositories(JSON.parse(repositorios));
    //     }
    // }, []);

    useEffect(() => {
        localStorage.setItem('@GithuExplorer:repositores',
        JSON.stringify(repositories),
    );
    }, [repositories]);

    async function handleAddRepository(
        e: FormEvent<HTMLFormElement>,
        ): Promise <void> {
        e.preventDefault();

        if (!newRepo) {
            setInputError('Digite a raça do cachorro');
            return;
        }

        try{
            const response = await api.get<Repository>(`repos/kinduff/dog-api`);
        const repository = response.data;
        setRepositories([...repositories, repository]);
        setNewRepo('');
        setInputError('');
        } catch(err) {
            setInputError('Erro na busca por essa raça');
        }
    }

    return (
        <>
        <img src={logoImg} alt='Github explorer' />
        <Title>Repositórios de fatos de cachorros</Title>
        <Form hasError={!! inputError} onSubmit={handleAddRepository}>
            <input
            value={newRepo}
            onChange={e => setNewRepo(e.target.value)}
            placeholder="Digite a raça do cachorro" />
            <button type="submit">Pesquisar</button>
        </Form>

        {inputError && <Error> {inputError} </Error>}
        <Repositories>
            {repositories.map(repository => (
                <Link
                key={repository.full_name}
                to={`/repository/${repository.full_name}`}
                >
                <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                />
                <div>
                    <strong> {repository.full_name} </strong>
                    <p>{repository.description}</p>
                </div>
                <FiChevronRight size={20} />
            </Link>
            ))}



        </Repositories>
        </>
    );
};

export default Dashboard;

