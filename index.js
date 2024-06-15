import { Command } from 'commander';
import inquirer from 'inquirer';
import * as fs from 'node:fs';


const program = new Command();
let tasks = [];

const saveTasks = (task) => {
    if (fs.existsSync('tasks.json')) {
        loadTasks();
        tasks.push(task);
        fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
        console.log('Task added successfully!');
    } else {
        tasks.push(task);
        fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    }
}

const loadTasks = () => {
    if (fs.existsSync('tasks.json')) {
        const data = fs.readFileSync('tasks.json', 'utf8');
        tasks = JSON.parse(data);
    }
}

const deleteTask = (taskName) => {
    if (fs.existsSync('tasks.json')) {
        const data = fs.readFileSync('tasks.json', 'utf8');
        tasks = JSON.parse(data);
        const index = tasks.findIndex(obj => obj.name === taskName);
        if (index !== -1) {
            tasks.splice(index, 1);
            fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
            console.log('Task deleted successfully!');
        } else {
            console.log('Task not found...');
        }
    } else {
        console.log('No tasks')
    }
}

const updateTask = (taskName, answer) => {
    if (fs.existsSync('tasks.json')) {
        const data = fs.readFileSync('tasks.json', 'utf8');
        tasks = JSON.parse(data);
        const index = tasks.findIndex(obj => obj.name === taskName);
        if (index !== -1) {
            tasks[index].status = answer.newStatus;
            fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
            console.log('Task updated successfully!');
        } else {
            console.log('Task not found...');
        }
    } else {
        console.log('No tasks')
    }
}

program
    .command('add')
    .alias('a')
    .description('Add new task')
    .action(() => {
        inquirer.prompt([
            { type: 'input', name: 'name', message: 'Task name:' },
            { type: 'input', name: 'dueDate', message: 'Due Date:' }
        ]).then((answer) => {
            saveTasks({ name: answer.name, dueDate: answer.dueDate, status: 'pending' });
        });
    })

program
    .command('list')
    .alias('l')
    .description('List all tasks')
    .action(() => {
        loadTasks();
        if (tasks.length !== 0) {
            console.table(tasks);
        } else {
            console.log('No tasks')
        }
    })

program
    .command('delete <taskName>')
    .alias('d <taskName>')
    .description('Delete Task')
    .action((taskName) => {
        deleteTask(taskName);
    })

program
    .command('update <taskName>')
    .description('Update status of the task')
    .action((taskName) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'newStatus',
                choices: ['pending', 'running', 'done']
            }
        ]).then((answer) => {
            updateTask(taskName, answer);
        })
    })

program.parse(process.argv); // to parse the command-line arguments and trigger the corresponding actions