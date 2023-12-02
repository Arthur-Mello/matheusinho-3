const express = require("express");
const router = express.Router();
const authenticateToken = require('./middleware/authenticateToken');
const alrealdyAuthenticated = require('./middleware/alrealdyAuthenticated');
const isAdminOrMedic = require('./middleware/isAdminOrMedic')
const isAdmin = require('./middleware/isAdmin')
const isMedic = require('./middleware/isMedic')
const controllers = {
  user: require("./controller/userController"),
  consulta: require("./controller/consultaController")
};

router.get('/', alrealdyAuthenticated, (req, res) => {
  const message = req.query.message || '';

  return res.render('index', { message });
});


router.post("/cadastrar", async (req, res) => {
  try {
    console.log("entrou no post")
    const message = await controllers.user.createUser(req.body);
    res.redirect(`/?message=${message}`);
  } catch (error) {
    res.redirect(`/?message=error`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await controllers.user.loginUser(req.body);

    console.log('Token:', token);

    if (token) {
      res.cookie('token', token, { httpOnly: true });
      return res.redirect("/dashboard");
    } else {
      const errorMessage = 'errorinvalido';
      return res.redirect(`/?message=${errorMessage}`);
    }
  } catch (error) {
    const errorMessage = 'error';
    return res.redirect(`/?message=${errorMessage}`);
  }
});

router.get("/dashboard", authenticateToken, isAdminOrMedic, async (req, res) => {

  if (req.user.cargo == "Médico") {
    const consultas = await controllers.consulta.getFiveConsultas(req.user.id);
    console.log(consultas)
    res.render('dashboard', { user: req.user, consultas: consultas });
  }
  res.render('dashboardAdmin', { user: req.user })
});

router.get("/usuarios", authenticateToken, isAdmin, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {

    const users = await controllers.user.getAllUsers(parseInt(page), parseInt(pageSize));
    res.render('usuarios', {
      user: req.user,
      users: users.rows,
      totalCount: users.count,
      totalPages: Math.ceil(users.count / parseInt(pageSize)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching paginated consultas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

router.get("/usuario/:userId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDetails = await controllers.user.getUser(userId);
    console.log(userDetails)
    res.render('usuario', { user: req.user, userDetails });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/atualizar", authenticateToken, isAdmin, async (req, res) => {
  const userId = req.body.userId;
  const updatedUserData = {
    username: req.body.username,
    email: req.body.email,
    permissionLevel: req.body.permissionLevel,
  };


  try {

    const existingUser = await controllers.user.getUser(userId);

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }


    const result = await controllers.user.updateUser(userId, updatedUserData);
    console.log(result)
    if (result === "success") {
      return res.redirect(`/usuario/${userId}`)
    } else if (result === "errorUsuarioInexistente") {
      return res.status(404).json({ error: 'User not found' });
    } else if (result === "errorEmailEmUso") {
      return res.status(400).json({ error: 'Email is already in use by another user' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/logout', authenticateToken, (req, res) => {

  res.clearCookie('token');

  res.redirect('/?message=logout');
});

router.get('/consultas', authenticateToken, isMedic, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const consultas = await controllers.consulta.getAllConsultas(req.user.id, parseInt(page), parseInt(pageSize));
    res.render('consultas', {
      user: req.user,
      consultas: consultas.rows,
      totalCount: consultas.count,
      totalPages: Math.ceil(consultas.count / parseInt(pageSize)),
      currentPage: parseInt(page),
    });
  } catch (error) {

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/consultas/antigas', authenticateToken, isMedic, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const consultas = await controllers.consulta.getAllConsultasPast(req.user.id, parseInt(page), parseInt(pageSize));
    res.render('consultasAntigas', {
      user: req.user,
      consultas: consultas.rows,
      totalCount: consultas.count,
      totalPages: Math.ceil(consultas.count / parseInt(pageSize)),
      currentPage: parseInt(page),
    });
  } catch (error) {

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/consultas/insert', authenticateToken, isMedic, async (req, res) => {
  try {

    const users = await controllers.user.getUsers();

    const errorMessage = req.query.error;

    res.render('adicionarConsulta', { user: req.user, users, errorMessage });
  } catch (error) {
    console.error('Error fetching users for consultation insertion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/consultas/insert', authenticateToken, isMedic, async (req, res) => {

  try {
    const { dataAgendada } = req.body;

    const selectedDate = new Date(dataAgendada);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      return res.redirect('/consultas/insert?error=Data inválida. Selecione uma data e horário diferente do tempo atual.');
    }

    await controllers.consulta.insertConsulta(req.body);

    return res.redirect('/consultas');
  } catch (error) {
    console.error('Error inserting consultation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/consultas/details/:consultaId', authenticateToken, isMedic, async (req, res) => {
  try {
    const consultaId = req.params.consultaId;
    const consultaDetails = await controllers.consulta.getConsultaDetails(consultaId);
    res.render('consulta', { user: req.user, consultaDetails });
  } catch (error) {
    console.error('Error fetching consultation details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/consultas/updateProntuario/:consultaId', authenticateToken, isMedic, async (req, res) => {
  const { prontuario } = req.body;
  const consultaId = req.params.consultaId;

  try {
    await controllers.consulta.updateProntuario(consultaId, prontuario);
    res.redirect(`/consultas/details/${consultaId}`);
  } catch (error) {
    console.error('Error updating prontuario:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/consultas/updateReceita/:consultaId', authenticateToken, isMedic, async (req, res) => {
  const { receita } = req.body;
  const consultaId = req.params.consultaId;

  try {
    await controllers.consulta.updateReceita(consultaId, receita);
    res.redirect(`/consultas/details/${consultaId}`);
  } catch (error) {
    console.error('Error updating receita:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/consultas/updateAtestado/:consultaId', authenticateToken, isMedic, async (req, res) => {
  const { atestado } = req.body;
  const consultaId = req.params.consultaId;

  try {
    await controllers.consulta.updateAtestado(consultaId, atestado);
    res.redirect(`/consultas/details/${consultaId}`);
  } catch (error) {
    console.error('Error updating atestado:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**/

router.get('/consultas/details/:consultaId', authenticateToken, async (req, res) => {
  try {
    const consultaId = req.params.consultaId;
    const prontuarios = await controllers.consulta.getProntuarios(consultaId);
    res.json({ prontuarios });
  } catch (error) {
    console.error('Error fetching prontuarios:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/consultas/details/:consultaId', authenticateToken, async (req, res) => {
  try {
    const consultaId = req.params.consultaId;
    const receitasMedicas = await controllers.consulta.getReceitasMedicas(consultaId);
    res.json({ receitasMedicas });
  } catch (error) {
    console.error('Error fetching receitas médicas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/consultas/details/:consultaId', authenticateToken, async (req, res) => {
  try {
    const consultaId = req.params.consultaId;
    const atestados = await controllers.consulta.getAtestados(consultaId);
    res.json({ atestados });
  } catch (error) {
    console.error('Error fetching atestados:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




/* fim rotas */
router.use((req, res) => {
  res.render('notExist', { user: req.user });
});
module.exports = router;
