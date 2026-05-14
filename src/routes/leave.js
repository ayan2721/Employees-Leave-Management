const express = require("express");
const { body } = require("express-validator");
const { authenticate, authorize } = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");
const {
    applyLeave,
    getMyLeaves,
    getPendingLeaves,
    approveLeave,
    rejectLeave
} = require("../controllers/leaveController");

const router = express.Router();

// 🔐 All routes protected
router.use(authenticate);

// APPLY LEAVE (UPLOAD FIXED)
router.post(
    "/apply",
    uploadSingle("file"), // ✅ MUST MATCH FRONTEND
    [
        body("leave_type")
        .isIn(["sick", "vacation", "personal", "maternity", "paternity"])
        .withMessage("Invalid leave type"),

        body("start_date").isISO8601().withMessage("Invalid start date"),

        body("end_date").isISO8601().withMessage("Invalid end date"),

        body("reason")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Reason must be at least 10 characters long"),
    ],
    applyLeave
);

// GET OWN LEAVES
router.get("/my", getMyLeaves);

// MANAGER ROUTES
router.get("/pending", authorize("manager"), getPendingLeaves);

router.put(
    "/approve/:id",
    authorize("manager"), [body("manager_comment").optional().trim()],
    approveLeave
);

router.put(
    "/reject/:id",
    authorize("manager"), [
        body("manager_comment")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Manager comment required"),
    ],
    rejectLeave
);

module.exports = router;