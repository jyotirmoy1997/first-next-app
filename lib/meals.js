import sql from 'better-sqlite3'
import slugify from 'slugify'
import xss from 'xss'
import fs from 'node:fs'

const db = sql('meals.db')

export async function getMeals(){
    await new Promise(resolve => setTimeout(resolve, 3000))
    return db.prepare('SELECT * from meals').all()
}

export function getMeal(slug){
    return db.prepare('SELECT * from meals WHERE slug = ?').get(slug)
}

export async function saveMeal(meal){
    meal.slug = slugify(meal.title, {lower : true})
    meal.instructions = xss(meal.instructions)
    const extension = meal.image.name.split('.').pop()
    const fileName = `${meal.slug}.${extension}`

    const stream = fs.createWriteStream(`public/images/${fileName}`)
    const bufferedImage = await meal.image.arrayBuffer();
    stream.write(Buffer.from(bufferedImage), (err) => {
        if(err)
            throw new Error('Something Went Wrong !')
    })

    meal.image = `/images/${fileName}`
    db.prepare(`
        INSERT INTO meals (title, instructions, creator, creator_email, image, slug, summary)
        VALUES (@title, @instructions, @creator, @creator_email, @image, @slug, @summary)
    `).run(meal)
}