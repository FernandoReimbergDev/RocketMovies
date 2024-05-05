const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knex("movie_tags").insert(tagsInsert);

    

    res.status(201).json();
  }

  async show(req, res) {
    const { id } = req.params;

    const movies = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ note_id: id }).orderBy("name");


    return res.json({
      ...movies,
      tags
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    await knex("movie_notes").where({ id }).delete();
    return res.json();
  }

  async index(req, res) {
    const { title, user_id } = req.query;

    let movies;

    if (movies) {
      const filterMovies = title.split(",").map((title) => title.trim());

      movies = await knex("movie_notes")
        .select([
          "movie.id",
          "movie.title",
          "movie.description",
          "movie.value",
          "movie.due_date",
          "movie.user_id",
        ])
        .where("movie.user_id", user_id)
        .whereLike("movie.title", `%${title}%`)
        .whereIn("name", filterMovies)
        .innerJoin("movie", "users.id", "movie.user_id")
        .orderBy("movie.title");
    } else {
      movies = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = movies.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.json(notesWithTags);
  }

  async update(req, res) {
    const { title, description, rating } = req.body;
    const { id } = req.params;

    const updatedMovie = await knex("movie_notes").where({ id }).update({
      title,
      description,
      rating,
    });

    if (updatedMovie === 0) {
      throw new AppError("filme  não encontrado");
    }

    return res.json();
  }
}

module.exports = MovieController;
