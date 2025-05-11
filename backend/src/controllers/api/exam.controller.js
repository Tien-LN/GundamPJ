const { prisma } = require("../../config/db");

const index = async (req, res) => {
  try {
    const courseId = req.query.courseId;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        deleted: false,
      },
      include: {
        exams: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course.exams);
  } catch (error) {
    return res.status(500).json({ message: "Server error!", error });
  }
};

const createPost = async (req, res) => {
  try {
    if (!req.body.courseId || !req.body.startDate || !req.body.endDate) {
      return res
        .status(404)
        .json({ message: "Bad request - Missing required fields" });
    }

    // Clean up nested arrays if empty
    if (req.body.questions && req.body.questions.length == 0)
      delete req.body.questions;
    if (req.body.UserExam && req.body.UserExam.length == 0)
      delete req.body.UserExam;

    const course = await prisma.course.findUnique({
      where: { id: req.body.courseId },
    });

    if (!course) {
      return res.status(400).json({ message: "Lỗi không tìm thấy khóa học" });
    }

    // Validate date formats
    try {
      // Create a data object with properly formatted dates
      const examData = {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      };

      const createdExam = await prisma.exam.create({
        data: examData,
      });

      res.status(200).json({
        message: "Đã tạo bài thi thành công",
        examId: createdExam.id,
      });
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({
        message: "Lỗi định dạng dữ liệu",
        details: validationError.message,
      });
    }
  } catch (error) {
    console.error("Error creating exam:", error);
    return res.status(500).json({
      message: "Lỗi server khi tạo bài thi",
      details: error.message,
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    // Handle both URL formats: /:id/createQuestion and /:courseId/exams/:examId/createQuestion
    const id = req.params.id || req.params.examId;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing exam ID in request params" });
    }

    console.log("Creating question for exam ID:", id);

    // Remove courseId from request body as it's not needed for question creation
    if (req.body.courseId) delete req.body.courseId;

    // Handle date format conversion if there are any dates in the request
    if (req.body.startDate) {
      try {
        req.body.startDate = new Date(req.body.startDate);
      } catch (e) {
        return res.status(400).json({ message: "Invalid startDate format" });
      }
    }

    if (req.body.endDate) {
      try {
        req.body.endDate = new Date(req.body.endDate);
      } catch (e) {
        return res.status(400).json({ message: "Invalid endDate format" });
      }
    }
    const exam = await prisma.exam.findUnique({
      where: { id: id },
    });
    if (!exam) {
      return res.status(400).json({ message: "Không tìm thấy bài thi!" });
    }

    if (!req.body.QuestionType) req.body.QuestionType = "OBJECTIVE";
    const questionType = req.body.QuestionType;
    const question = await prisma.question.create({
      data: {
        examId: id,
        type: questionType,
        content: req.body.content,
      },
    });

    if (questionType == "OBJECTIVE" || questionType == "DROPDOWN") {
      if (!req.body.answers || req.body.answers.length <= 1) {
        return res.status(400).json({ message: "Cần thêm câu trả lời" });
      }
      // return res.send(req.body);
      await Promise.all(
        req.body.answers.map((item) =>
          prisma.questionOption.create({
            data: {
              questionId: question.id,
              content: item[0],
              isCorrect: item[1] == "true",
            },
          })
        )
      );
    } else if (questionType == "FILL") {
      await Promise.all(
        req.body.answers.map((item) =>
          prisma.questionOption.create({
            data: {
              questionId: question.id,
              content: item,
              isCorrect: true,
            },
          })
        )
      );
    } else if (questionType == "MATCHING") {
      let countOptions = 0;
      for (const item of req.body.answers) {
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            content: item[0],
            isCorrect: true,
            num: ++countOptions,
          },
        });
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            content: item[1],
            isCorrect: true,
            num: countOptions,
          },
        });
        console.log(item[0] + " " + item[1]);
      }
    } else if (questionType == "REORDERING") {
      let countNumber = 0;
      await Promise.all(
        req.body.answers.map((item) =>
          prisma.questionOption.create({
            data: {
              questionId: question.id,
              content: item,
              isCorrect: true,
              num: ++countNumber,
            },
          })
        )
      );
    }
    res.send("Đã tạo thành công");
  } catch (error) {
    console.error("Error in createQuestion:", error);
    return res
      .status(400)
      .json({ message: "Lỗi j đó rồi", error: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const examId = req.params.examId;

    const questions = await prisma.exam.findFirst({
      where: {
        id: examId,
        deleted: false,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return res.send(questions);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

const changeQuestionPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const exam = await prisma.exam.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!exam) {
      return res.status(404).json({ message: "Không tìm thấy bài thi" });
    }

    const questionId = req.query.QuestionId;

    const questionType = req.body.QuestionType || "OBJECTIVE";

    req.body.QuestionType = questionType;

    if (questionType == "DROPDOWN" || questionType == "OBJECTIVE") {
      if (!req.body.questions || req.body.questions.length <= 1) {
        return res
          .status(400)
          .json({ message: "Số lượng câu cần thiết là 2 trở lên" });
      }
    }

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        options: true,
      },
    });
    if (!question) {
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    }

    await prisma.question.update({
      where: { id: question.id },
      data: {
        content: req.body.content,
        type: questionType,
      },
    });
    await Promise.all(
      question.options.map((item) =>
        prisma.questionOption.delete({
          where: { id: item.id },
        })
      )
    );

    if (questionType == "OBJECTIVE" || questionType == "DROPDOWN") {
      req.body.questions.forEach(async (item) => {
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            content: item[0],
            isCorrect: item[1],
          },
        });
      });
    } else if (questionType == "FILL") {
      await Promise.all(
        req.body.answers.map((item) =>
          prisma.questionOption.create({
            data: {
              questionId: question.id,
              content: item,
              isCorrect: true,
            },
          })
        )
      );
    } else if (questionType == "MATCHING") {
      let countOptions = 0;
      for (const item of req.body.answers) {
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            content: item[0],
            isCorrect: true,
            num: ++countOptions,
          },
        });
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            content: item[1],
            isCorrect: true,
            num: countOptions,
          },
        });
      }
    } else if (questionType == "REORDERING") {
      let countNumber = 0;
      await Promise.all(
        req.body.answers.map((item) =>
          prisma.questionOption.create({
            data: {
              questionId: question.id,
              content: item,
              isCorrect: true,
              num: ++countNumber,
            },
          })
        )
      );
    }
    res.send("Đã thay đổi thành công");
  } catch (error) {
    return res.status(400).json({ message: "Lỗi j rồi", error });
  }
};

// [DELETE] api/exams/:courseId/exams/:examId/:questionId
const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    await prisma.questionOption.deleteMany({
      where: {
        questionId: questionId,
      },
    });
    const result = await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return res.send("Đã xóa thành công!!");
  } catch (error) {
    return res.status(500).json({ message: "server error!" });
  }
};

// [DELETE] api/exams/:courseId/exams/:examId
const deleteExam = async (req, res) => {
  try {
    const examId = req.params.examId;
    const questions = await prisma.question.findMany({
      where: {
        examId: examId,
      },
      select: {
        id: true,
      },
    });

    const questionIds = questions.map((q) => q.id);

    if (questionIds.length > 0) {
      await Promise.all(
        questionIds.map((id) =>
          prisma.questionOption.deleteMany({
            where: {
              questionId: id,
            },
          })
        )
      );

      await prisma.question.deleteMany({
        where: { id: { in: questionIds } },
      });
    }
    await prisma.exam.delete({
      where: {
        id: examId,
      },
    });
    return res.send("Đã xóa thành công!!");
  } catch (error) {
    return res.status(500).json({ message: "server error!" });
  }
};
module.exports = {
  index,
  createPost,
  createQuestion,
  getQuestions,
  changeQuestionPatch,
  deleteQuestion,
  deleteExam,
};
