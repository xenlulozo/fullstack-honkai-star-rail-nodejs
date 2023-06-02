import express from "express";
import pool from "../configs/connectDB";
// import homePageController from "../../controllers/homePageController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/info/:id", async (req, res) => {
    const { id } = req.params;
    const [row, fields] = await pool.execute(
      `SELECT JSON_OBJECT( 'id', c.id,'name', c.name, 'rarity', c.rarity, 'element', c.element,'path', c.path, 'skills', CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'skillId', s.skillId, 'name', s.name, 'type', s.type, 'desc', s.description, 'tags', s.tags ) SEPARATOR ','), ']' ), 'energyUltimate', c.energyUltimate ) AS json_data FROM \`character\` c JOIN skill s ON c.id = s.characterId WHERE c.id = ${id} GROUP BY c.id;`
    );
    // return res.render("hse.ejs", { data: row });
    return res.send(JSON.stringify(row));
  });
  router.get("/traces/:id", async (req, res) => {
    const { id } = req.params;
    const [row, fields] = await pool.execute(
      `SELECT CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'req', cts.req, 'desc', cts.description, 'name', cts.name, 'sub_nodes', IFNULL(subnodes_json, '[]') ) SEPARATOR ','), ']') AS traces FROM CharacterTraces cts LEFT JOIN ( SELECT ctsn.traceId, CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'req', ctsn.req, 'stat', ctsn.stat, 'value', ctsn.value ) SEPARATOR ','), ']') AS subnodes_json FROM CharacterTracesSubNodes ctsn GROUP BY ctsn.traceId ) subnodes ON cts.traceId = subnodes.traceId WHERE cts.characterId = ${id}  GROUP BY cts.traceId;`
    );
    // return res.render("hse.ejs", { data: row });
    return res.send(JSON.stringify(row));
  });
  router.get("/eidolon/:id", async (req, res) => {
    const { id } = req.params;
    const [row, fields] = await pool.execute(
      `SELECT JSON_OBJECT( 'eidolonId', eidolonId, 'upgrade1Name', upgrade1Name, 'upgrade1Desc', JSON_OBJECT('raw', upgrade1Desc), 'upgrade2Name', upgrade2Name, 'upgrade2Desc', JSON_OBJECT('raw', upgrade2Desc),'upgrade3Name', upgrade3Name, 'upgrade3Desc', JSON_OBJECT('raw', upgrade3Desc), 'upgrade4Name', upgrade4Name, 'upgrade4Desc', JSON_OBJECT('raw', upgrade4Desc), 'upgrade5Name', upgrade5Name, 'upgrade5Desc', JSON_OBJECT('raw', upgrade5Desc),'upgrade6Name', upgrade6Name,'upgrade6Desc', JSON_OBJECT('raw', upgrade6Desc) ) AS eidolon FROM eidolon where id =${id};`
    );
    return res.send(JSON.stringify(row));
  });
  router.get("/list", async (req, res) => {
    const [row, fields] = await pool.execute(
      "SELECT CONCAT('[', GROUP_CONCAT(json_data SEPARATOR ','), ']') AS json_array FROM ( SELECT JSON_OBJECT( 'id', character.id, 'name', character.name, 'element', character.element, 'path' ,character.path  ) AS json_data FROM hsr.character ) AS subquery;"
    );
    // return res.render("hse.ejs", { data: row });
    return res.send(JSON.stringify(row));
    // return res.send(row);
  });
  router.get("/test", async (req, res) => {
    const [row, fields] = await pool.execute(
      "SELECT CONCAT('[', GROUP_CONCAT(json_data SEPARATOR ','), ']') AS json_array FROM ( SELECT JSON_OBJECT( 'id', character.id, 'name', character.name ) AS json_data FROM hsr.character ) AS subquery;"
    );
    return res.json(row);
  });
  router.get("/element", async (req, res) => {
    const [row, fields] = await pool.execute(
      "SELECT CONCAT('[', GROUP_CONCAT(json_data SEPARATOR ','), ']') AS json_array FROM ( SELECT JSON_OBJECT( 'element', element.name) AS json_data FROM hsr.element ) AS subquery;"
    );
    return res.json(row);
  });
  router.get("/path", async (req, res) => {
    const [row, fields] = await pool.execute(
      "SELECT CONCAT('[', GROUP_CONCAT(json_data SEPARATOR ','), ']') AS json_array FROM ( SELECT JSON_OBJECT( 'path', path.name) AS json_data FROM hsr.path ) AS subquery;"
    );
    return res.json(row);
  });

  return app.use("/", router);
};
module.exports = initWebRoutes;
