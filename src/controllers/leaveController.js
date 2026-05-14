const { validationResult } = require('express-validator');
const LeaveRequest = require('../models/LeaveRequest');
const { uploadFileToBlob } = require('../services/blobService');
const { AppError } = require('../utils/errors');

const applyLeave = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array()
            });
        }

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { leave_type, start_date, end_date, reason } = req.body;
        const userId = req.user.id;

        let documentUrl = null;

        // FILE UPLOAD
        if (req.file) {
            try {
                documentUrl = await uploadFileToBlob(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype
                );
            } catch (uploadError) {
                console.error("UPLOAD ERROR:", uploadError);
                return next(
                    new AppError(uploadError.message, 500)
                );
            }
        }

        const leaveRequest = await LeaveRequest.create({
            user_id: userId,
            leave_type,
            start_date,
            end_date,
            reason,
            document_url: documentUrl,
        });

        res.status(201).json({
            status: "success",
            data: { leaveRequest },
        });
    } catch (error) {
        next(error);
    }
};
const getPendingLeaves = async(req, res, next) => {
    try {
        const leaves = await LeaveRequest.findAllPending();

        res.status(200).json({
            status: 'success',
            results: leaves.length,
            data: {
                leaves
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMyLeaves = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const leaves = await LeaveRequest.findByUserId(userId);

        res.status(200).json({
            status: 'success',
            results: leaves.length,
            data: {
                leaves
            }
        });
    } catch (error) {
        next(error);
    }
};

const approveLeave = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { manager_comment } = req.body;

        const leave = await LeaveRequest.updateStatus(id, 'approved', manager_comment);

        if (!leave) {
            return next(new AppError('Leave request not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        next(error);
    }
};

const rejectLeave = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { manager_comment } = req.body;

        if (!manager_comment) {
            return next(new AppError('Manager comment is required for rejection', 400));
        }

        const leave = await LeaveRequest.updateStatus(id, 'rejected', manager_comment);

        if (!leave) {
            return next(new AppError('Leave request not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getPendingLeaves,
    approveLeave,
    rejectLeave
};