import { Injectable } from '@nestjs/common';
import * as inquirer from 'inquirer'; // Change the import here

@Injectable()
export class GameService {
  async initGame(): Promise<void> {
    const questions: inquirer.QuestionCollection = [
      // Adjust the type here
      {
        name: 'name',
        message: 'What is your name, adventurer?',
        type: 'input',
      },
    ];

    const answers = await inquirer.prompt(questions);
    console.log(`Welcome, ${answers.name}! Your journey begins now...`);

    // Here you can now call the UserService to create the user
    // or update the user information based on the answers.
  }
}
