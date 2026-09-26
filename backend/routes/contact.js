const express = require('express')
const router = express.Router()

const Contact = require('../model/contact')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

/* User - Create Support Ticket */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      })
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      })
    }

    const contact = await Contact.create({
      userId: req.user.userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || 'Customer Support',
      messages: [
        {
          senderType: 'User',
          senderId: req.user?.userId || null,
          message: message.trim(),
        },
      ],
    })

    res.status(201).json({
      success: true,
      message: 'Your support request has been sent successfully',
      data: contact,
    })
  } catch (error) {
    console.error('Contact Create Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to send support request',
    })
  }
})

/* Admin - Get All Support Tickets */
router.get('/admin', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().populate('userId', 'name email phone').populate('messages.senderId', 'name email role').sort({ updatedAt: -1 })

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    console.error('Contact Admin Get Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch support tickets',
    })
  }
})

/* Admin - Get Single Support Ticket */
router.get('/admin/:id', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('userId', 'name email phone').populate('messages.senderId', 'name email role')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      })
    }

    res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error('Contact Single Get Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch support ticket',
    })
  }
})

/* Admin - Reply to Support Ticket */
router.post('/admin/:id/reply', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const { message } = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
      })
    }

    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      })
    }

    contact.messages.push({
      senderType: 'Admin',
      senderId: req.user.userId,
      message: message.trim(),
    })

    contact.status = 'In Progress'

    await contact.save()

    const updatedContact = await Contact.findById(contact._id).populate('userId', 'name email phone').populate('messages.senderId', 'name email role')

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: updatedContact,
    })
  } catch (error) {
    console.error('Contact Admin Reply Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to send reply',
    })
  }
})

/* Admin - Update Support Ticket Status */
router.put('/admin/:id/status', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const { status } = req.body

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate('userId', 'name email phone')
      .populate('messages.senderId', 'name email role')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      })
    }

    res.status(200).json({
      success: true,
      message: `Support ticket marked as ${status}`,
      data: contact,
    })
  } catch (error) {
    console.error('Contact Status Update Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to update support status',
    })
  }
})

/* Admin - Delete Support Ticket */
router.delete('/admin/:id', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Support ticket deleted successfully',
    })
  } catch (error) {
    console.error('Contact Delete Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to delete support ticket',
    })
  }
})

/* User - Get My Support Tickets */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({
      userId: req.user.userId,
    })
      .populate('messages.senderId', 'name email role')
      .sort({ updatedAt: -1 })

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    console.error('User Support Get Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch your support requests',
    })
  }
})

/* User - Get Single Support Ticket */
router.get('/my/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate('messages.senderId', 'name email role')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      })
    }

    res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error('User Single Support Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch support request',
    })
  }
})

/* User - Reply to Support Ticket */
router.post('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      })
    }

    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      })
    }

    if (contact.status === 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'This support ticket has already been resolved',
      })
    }

    contact.messages.push({
      senderType: 'User',
      senderId: req.user.userId,
      message: message.trim(),
    })

    contact.status = 'Pending'

    await contact.save()

    const updatedContact = await Contact.findById(contact._id).populate('messages.senderId', 'name email role')

    res.status(200).json({
      success: true,
      message: 'Your reply has been sent successfully',
      data: updatedContact,
    })
  } catch (error) {
    console.error('User Support Reply Error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to send reply',
    })
  }
})

module.exports = router
